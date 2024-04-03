const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const crypto = require('crypto');


const sendToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = sendToken(user._id);

    res.cookie('jwt', token, {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    })

    //remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    
    createSendToken(newUser, 201, res);
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new Error("Please provide email and password", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password)))
        return next(new Error("Incorrect Email or Password", 401));

    createSendToken(user, 200, res);
}

exports.currentUser = async function (req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return next(new Error("User not found", 404));
        res.status(200).json({
            status: 'success',
            data: {
                user: currentUser
            }
        })
    }

    res.status(404).json({
        status: 'fail',
        message: 'User not found'
    })
}

exports.protect = async function (req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token)
        return next(new Error("You are not logged in! Please log in to get access", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new Error("The user belonging to this token does no longer exist.", 404));

    if (currentUser.changedPasswordAfter(decoded.iat))
        return next(new Error("User recently changed password! Please log in again", 401));

    req.user = currentUser;
    next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new Error("You do not have permission to perform this action", 403));

        next();
    }
}

exports.forgotPassword = async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new Error('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'your password reset token (valid for 10 min)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to Email'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new Error('There was an error sending the email. Try again later!'),
            500
        );
    }

    next();
}

exports.resetPassword = async (req, res, next) => {
    // 1) Hash the token in the url 
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    //Get the user based on the hashed token
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // 2) If the user doesnot exist send error
    if (!user) {
        return next(new Error('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // 3) update changedPasswordAt property 

    // 4) Log the user in, send JWT
    createSendToken(user, 20, res);
    next();
}
const express = require('express');
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const userRouter = express.Router();  //Router call

userRouter.route('/signup').post(authController.signup) //checked
userRouter.route('/signin').post(authController.signin) //checked 
userRouter.route('/logout').get(authController.logout) //checked

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protect); //Protect all routes after this middleware

userRouter.route('/updatePassword').patch(authController.updatePassword) //checked

//Read , Update and Delete operations for logged in user
userRouter.route('/me').get(userController.getMe, userController.getUser) //checked
userRouter.patch(
    '/updateMe',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
);

userRouter.delete('/deleteMe', userController.deleteMe);

module.exports = userRouter;
const express = require('express');
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const userRouter = express.Router();  //Router call

userRouter.route('/signup').post(authController.signup) //Mounted route 
userRouter.route('/signin').post(authController.signin) //Mounted route 
userRouter.route('/logout').get(authController.logout) //Mounted route

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); //Protect all routes after this middleware

userRouter.route('/updatePassword').patch(authController.updatePassword) //Mounted route
//Read , Update and Delete operations for logged in user
userRouter.route('/me').get(userController.getMe, userController.getUser) //Mounted route

module.exports = userRouter ;
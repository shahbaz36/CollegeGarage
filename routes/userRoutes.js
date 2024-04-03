const express = require('express');
const authController = require('../controllers/authController')

const userRouter = express.Router();  //Router call

userRouter.route('/signup').post(authController.signup) //Mounted route 
userRouter.route('/signin').post(authController.signin) //Mounted route 
userRouter.route('/me').get(authController.currentUser) //Mounted route

module.exports = userRouter ;
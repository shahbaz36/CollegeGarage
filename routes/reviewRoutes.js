const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const express = require('express');

const reviewRouter = express.Router();

reviewRouter
    .route('/')
    .get(reviewController.getAllReviews)

module.exports = reviewRouter; 
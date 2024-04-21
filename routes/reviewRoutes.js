const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const express = require('express');

const reviewRouter = express.Router({mergeParams: true});

reviewRouter
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setItemUserIds,
        reviewController.createReview
    );

reviewRouter.route('/:id')
    .get(reviewController.getReview) 
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

module.exports = reviewRouter; 
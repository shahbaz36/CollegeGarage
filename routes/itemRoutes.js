const express = require('express');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const itemRouter = express.Router();

//Nested Routes
itemRouter.use('/:itemId/reviews', reviewRouter);

itemRouter
    .route('/')
    .get(itemController.getAllItems)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        itemController.createItem);

itemRouter
    .route('/create')
    .post(authController.protect, itemController.createItem);

itemRouter
    .route('/:id')
    .get(itemController.getItem)
    .delete(
        authController.protect,
        itemController.deleteItem
    )

itemRouter.route('/:id/reviews')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        reviewController.createReview
    );


module.exports = itemRouter;
const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// This method sets the item and user fiels in the review document
exports.setItemUserIds = catchAsync(async (req, res, next) => {
    //if not mentioned in body, then comes from url in case of nested routes 
    if (!req.body.item) req.body.item = req.params.itemId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Item = require('../models/itemModel');
const factory = require('./handlerFactory');

exports.getAllItems = catchAsync(async (req, res, next) => {
    const items = await Item.find();

    res.status(200).json({
        status: 'success',
        results: items.length,
        data: {
            items
        }
    })
});

exports.createItem = catchAsync(async (req, res, next) => {
    const newItem = await Item.create(req.body);
    newItem.createdBy = req.user.id;
    await newItem.save({validateBeforeSave: false});

    res.status(201).json({
        status: 'success',
        data: {
            item: newItem
        }
    });
});

exports.getItem = catchAsync(async (req, res, next) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return next(new AppError('No item found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            item
        }
    });
});


exports.deleteItem = catchAsync(async (req, res, next) => {
    // Check if the user is the creator of the item or an admin

    // 1) find the creator 
    const item = await Item.findById(req.params.id);
    const creator = await item.createdBy.toString(); // Convert to string to match the user id

    // 2) compare the creator with the user
    if (req.user.id === creator || req.user.role === "admin") {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return next(new AppError('No item found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } else {
        res.status(403).json({
            status: 'fail',
            message: 'You are not authorized to delete this item.'
        });
    }
});

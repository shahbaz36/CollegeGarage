const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Item = require('../models/itemModel');

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

    res.status(201).json({
        status: 'success',
        data: {
            item: newItem
        }
    });
});
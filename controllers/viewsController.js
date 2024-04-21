const catchAsync = require('../utils/catchAsync');
const Item  = require('../models/itemModel');   

exports.getOverview = catchAsync(async (req, res, next) => {
    const items = await Item.find();
    res.status(200).render('overview', {
        title : 'All Items',
        items
    });
});


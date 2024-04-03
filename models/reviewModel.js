// review / rating / createdAt / ref to item / ref to user
const mongoose = require('mongoose');
const Item = require('./itemModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Item',
            required: [true, 'Review must belong to an item.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ item: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (itemId) {
    const stats = await this.aggregate([
        {
            $match: { item: itemId }
        },
        {
            $group: {
                _id: '$item',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    if (stats.length > 0) {
        await item.findByIdAndUpdate(itemId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await item.findByIdAndUpdate(itemId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};


reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcAverageRatings(this.item);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.item);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'An item must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'An item name must have less or equal then 40 characters'],
            minlength: [10, 'An item name must have more or equal then 10 characters']
            // validate: [validator.isAlpha, 'item name must only contain characters']
        },
        slug: String,
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'An item must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'An item must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'An item must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretitem: {
            type: Boolean,
            default: false
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

itemSchema.index({ price: 1, ratingsAverage: -1 });
itemSchema.index({ slug: 1 });

// Virtual populate
itemSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'item',
    localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
itemSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./../../models/itemModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
const itemController = require('./../../controllers/itemController');
dotenv.config({ path: './config.env' });


const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB)
    .then(() => console.log("DB connection successful!"))
    .catch(error => console.error("Error connecting to DB:", error));

// READ JSON FILE
const items = JSON.parse(fs.readFileSync(`${__dirname}/items-sample.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users-sample.json`, 'utf-8'));
// const reviews = JSON.parse(
//     fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Item.create(items);
        // await User.create(users, {validateBeforeSave: false});
        // await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (error) {
        console.error(error);
    }
    process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
      await Tour.deleteMany();
      await User.deleteMany();
    //   await Review.deleteMany();
      console.log('Data successfully deleted!');
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
  

importData();
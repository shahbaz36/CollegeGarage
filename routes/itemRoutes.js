const express = require('express');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const itemRouter = express.Router();

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
   

module.exports = itemRouter;
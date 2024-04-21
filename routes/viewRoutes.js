const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const viewRouter= express.Router();

viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', viewController.getOverview);

viewRouter.get('/header', (req, res) => {
    res.status(200).render('_header');
});
viewRouter.get('/login', (req, res) => {
    res.status(200).render('login');
});
viewRouter.get('/about', (req, res) => {
    res.status(200).render('about');
});
viewRouter.get('/contact', (req, res) => {
    res.status(200).render('contact');
});
viewRouter.get('/shop', (req, res) => {
    res.status(200).render('shop');
});

module.exports = viewRouter;    
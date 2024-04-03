//External modules 
const express = require('express');
const cookieParser = require('cookie-parser');

//User defined modules
const AppError = require('./utils/AppError');
const itemRouter = require('./routes/itemRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json()); //middleware to parse the body of the request
app.use(cookieParser()); 

//API Routes
app.use('/api/v1/users', userRouter);  //USer Routes
app.use('/api/v1/items', itemRouter);  //Item Routes
app.use('/api/v1/reviews', reviewRouter);  //Review Routes
app.use('/api/v1/order', orderRouter);  //Order Routes

// Check if the server is running
app.get('/direct-approach', (req, res) => { res.send("hello from express") });

//Error handling middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
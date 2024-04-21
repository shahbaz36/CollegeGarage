//External modules 
const express = require('express');
const cookieParser = require('cookie-parser');
const pug = require('pug');
const path = require('path');

//User defined modules
const AppError = require('./utils/AppError');
const itemRouter = require('./routes/itemRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Set up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json()); //middleware to parse the body of the request
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//API Routes
app.use('/api/v1/users', userRouter);  //USer Routes
app.use('/api/v1/items', itemRouter);  //Item Routes
app.use('/api/v1/reviews', reviewRouter);  //Review Routes
// app.use('/api/v1/order', bookingRouter);  //Order Routes
app.use("/", viewRouter); //View Routes

// Check if the server is running
app.get('/direct-approach', (req, res) => { res.send("hello from express") });

//Error handling middleware
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find  ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
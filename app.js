const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);  //Base route 

//Setting up Website overview
const viewRouter = express.Router();
// viewRouter.route('/homepage',homepage);
// viewRouter.route('/login',login);   
// viewRouter.route('/login',login);   
// viewRouter.route('/login',login);   
app.use('/', viewRouter);


app.get('/direct-approach', (req, res) => { res.send("hello from express") });

module.exports = app;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB)
    .then(() => console.log("DB connection successful!"))
    .catch(error => console.error("Error connecting to DB:", error));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

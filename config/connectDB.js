const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () =>  {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI);
        mongoose.set('strictQuery', false);
        console.log('the database is connected');
    } catch (error) {
        console.dir(error)
    }
}

module.exports = connectDB;
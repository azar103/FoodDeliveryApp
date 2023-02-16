const express = require('express');
const app = express();
const connectDB = require('./config/connectDB');

const itemRouter = require('./routers/item');
const userRouter = require('./routers/user');
const {errorHandler} = require('./middlewares/errorHandler');
const port = 5000;
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use('/api/items', itemRouter);
app.use('/api/account', userRouter);
app.use(errorHandler);


app.listen(port, (err) => {
    console.log(`the server is running on port ${port}...`);
})
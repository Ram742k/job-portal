const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use('/users',userRouter)
// app.use('/create',userRouter)


module.exports = app;
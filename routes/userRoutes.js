const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

// define the route for getting all users
userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.postUser);
userRouter.post('/login', userController.login);

userRouter.get('/logout', userController.logout);

userRouter.get('/:id', userController.getUserID);


module.exports = userRouter;
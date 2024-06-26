const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

// define the route for getting all users
userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.postUser);
userRouter.get('/:id', userController.getUserID);
userRouter.put('/:id', userController.updateUser);
userRouter.post('/login', userController.login);

module.exports = userRouter;
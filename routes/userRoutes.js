const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

// define the route for getting all users
userRouter.get('/', auth.verifyToken, userController.getAllUsers);
userRouter.post('/', userController.postUser);
userRouter.post('/login', userController.login);
userRouter.get('/logout',auth.verifyToken,userController.logout);

userRouter.get('/:id',auth.verifyToken, userController.getUserID);

userRouter.put('/:id',auth.verifyToken, userController.updateUser);
userRouter.delete('/:id',auth.verifyToken, userController.deleteUser);


module.exports = userRouter;
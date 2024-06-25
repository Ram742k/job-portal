const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.get('/users', async (request, response) => {
    try {
        const users = await User.find({}, {_id: 0, password: 0});
        response.status(200).json(users);
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
})

app.post('/create',async (request, response) => {
    try {
        const user = new User(request.body);
        await user.save();
        response.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
})

module.exports = app;
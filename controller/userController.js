const User = require('../models/user');

// define the contoller for the user
const userController = {
    getAllUsers: async (request, response) => {
        try {
            const users = await User.find({}, {_id: 0, password: 0});
            response.status(200).json(users);
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
    postUser: async (request, response) => {
        try {
            const user = new User(request.body);
            // check user is already register or not
            const isUserExist = await User.findOne({ email: user.email });
            if (isUserExist) {
                return response.status(400).send({ message: 'User already exist'});
            }
            // save the user
            const savedUser =  await user.save();
            response.status(201).send({message: 'User created successfully',
                user:savedUser
            });
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
    getUserID: async (request, response) => {
        try {
            const userID = request.params.id;
            const user = await User.findById(userID);
            if (!user) {
                return response.status(404).send({ message: 'User not found'});
            }
            response.status(200).json(user);
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },

    updateUser: async (request, response) => {
        try {
            const userID = request.params.id;
            const user = await User.findOneAndUpdate({ _id: userID }, request.body, { new: true });
            if (!user) {
                return response.status(404).send({ message: 'User not found'});
            }
            response.status(200).json(user);
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    }
        
    }


module.exports = userController;
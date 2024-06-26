const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// define the contoller for the user
const userController = {
    getAllUsers: async (request, response) => {
        try {
            const {email}  = request.query;
            if (email) {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return response.status(404).send({ message: 'User not found'});
                }
                response.status(200).json(user);
            }

            const users = await User.find({}, {_id: 0, password: 0});
            response.status(200).json(users);
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
    postUser: async (request, response) => {
        try {
            const {name, email, password} = new User(request.body);
            // check user is already register or not
            const isUserExist = await User.findOne({ email });

            if (isUserExist) {
                return response.status(400).send({ message: 'User already exist'});
            }
            
            //password hashing 
            const hashPassword = await bcrypt.hash(password, 10);

            // create new user
            const newUser = new User({name,email,password: hashPassword });

            // save the user
            const savedUser =  await newUser.save();

            response.status(201).send({message: 'User created successfully',
                newUser:savedUser
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


    login: async (request, response) => {
        try {
            const {email, password} = request.body;
            const user = await User.findOne({ email });
            if (!user) {
                return response.status(404).send({ message: 'User not found'});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return response.status(400).send({ message: 'Invalid credentials'});
            }

            //gernerate jwt token 

            const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY);

            //set a  cookie with token
            response.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', expire: new Date(Date.now() + 24 * 3600000)});
            // send response
            response.status(200).json({message: 'Login successful'});

            }
            catch (error) {
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
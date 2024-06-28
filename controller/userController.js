const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
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
            // get the user email and password from the request body
            const { email, password } = request.body;

            // check if the user exists in the database
            const user = await User.findOne({ email });

            // if the user does not exist, return an error response
            if (!user) {
                return response.status(404).send({ message: 'User not found' });
            }

            // if the user exists, compare the password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // if the password is invalid, return an error response
            if(!isPasswordValid) {
                return response.status(400).send({ message: 'Invalid password' });
            }

            // generate a JWT token
            const token = jwt.sign({ id: user._id }, SECRET_KEY);

            // set a cookie with the token
            response.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                expires: new Date(Date.now() + 24 * 3600000) // 24 hours from login
            });

            response.status(200).json({ message: 'Login successful' });
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
    logout: async (request, response) => {
        try {
            // clear the cookie
            response.clearCookie('token');

            response.status(200).send({ message: 'Logged out successfully' });
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
    updateUser: async (request, response) => {
        try {
            // get the user id from the request params
            const { id } = request.params;

            // get the updated user data from the request body
            const { name, email } = request.body;

            // check if the user exists in the database
            const user = await User.findById(id);

            // if the user does not exist, return an error response
            if (!user) {
                return response.status(404).send({ message: 'User not found' });
            }
            
            // update the user's name, email
            if(name){
                user.name = name;
            }
            if(email){
                user.email = email;
            }
            
            
            // save the updated user to the database
            await user.save();
            
            response.status(200).send({ message: 'User updated successfully' });


        }
        catch (error) {
            response.status(500).send({ message: error.message });
        }
    },

    deleteUser: async (request, response) => {
     try{
         const { id } = request.params;
         const user = await User.findById(id);
         if(!user){
             return response.status(404).send({message:'User not found'});
         }
         await user.deleteOne();
         response.status(200).send({message:'User deleted successfully'});
     }   
     catch (error){
         response.status(500).send({message:error.message});
     }
    },

    getProfile: async (request, response) => {
        try {
            // get the user id from the request object
            const userId = request.userId;
            
            const user = await User.findById(userId).select('-password');
            
            // if the user does not exist, return an error response
            if (!user) {
                return response.status(404).send({ message: 'User not found' });
            }
            
            
            // return the user data as a response
            response.status(200).send({message:'User found', user});
            }
    catch(error){
        response.status(500).send({ message: error.message });
    }

}   
    }


module.exports = userController;
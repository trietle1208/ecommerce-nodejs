const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {generateToken} = require('../config/jwtToken');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error("User already exists");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    //check user in DB
    const findUser = await User.findOne({email});
    const isPasswordMatched = await bcrypt.compare(password, findUser.password)
    if(findUser && isPasswordMatched){
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        throw new Error(error);
    }
});

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateUser = await User.findByIdAndUpdate(
            id, 
            {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            }
        );
        res.json(updateUser)
    } catch (error) {
        throw new Error(error);
    }
})
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const block = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: true
            },
            {
                new: true
            }
        );
        res.json({
            message: "User Blocked!"
        })
    } catch(error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const unblock = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: false
            },
            {
                new: true
            }
        );
        res.json({
            message: "User Unblocked!"
        })
    } catch(error) {
        throw new Error(error);
    }
});
module.exports = { createUser, loginUser, getUsers, getUser, deleteUser, updateUser, blockUser, unblockUser };
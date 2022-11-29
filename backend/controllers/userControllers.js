const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt=require('bcryptjs');
const generateToken = require('./utils/generateToken');

const registerUser = asyncHandler(async(req,res) => {
    const {name,email,password,pic} = req.body; //Requesting all those from request

    //If user exists,return error else create a collection
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error('User Already exists');
    }


    const user = await User.create({
        name,
        email,
        password,
        pic,
    });
    
    //If user successfully created, then return 201

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            pic:user.pic,
            token:generateToken(user._id),
        });
    }else
    {
        res.status(400);
        throw new Error('Error occured!');

    }
    });



    const authUser = asyncHandler(async(req,res) => {
        const { email,password } = req.body; //Requesting all those from request
    

        //To login, we need email and password
        const user = await User.findOne({ email }); //email is unique
        if(user && (await user.matchPassword(password)))
        {
            res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token:generateToken(user._id),
            });
        }
        else
        {
            res.status(400);
            throw new Error("Invalid Email! or password ");
        }

    });
           
module.exports={registerUser,authUser}




  
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/util.js";


 export const signUp = async (req , res) => {
    const {fullName , email , password} = req.body;

    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({
                message : "Provide All the details"
            })
        }
        // if(password.length() < 6) {
        //     return res.status(400).json({message : "password must be greater than 6 character"})
        // }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const isUserExist = await User.findOne( {email});
        if(isUserExist) {
            return res.status(400).json({
                message : "User with this email already exists"
            })
        }
       
        const newUser =new  User({
            fullName ,
            email ,
            password : hashedPassword
        })
        await newUser.save();

        if(newUser) {
         const token =   generateToken(newUser._id , res);
        return   res.status(201).json({
            message : "Successfully Signup" ,
            data : newUser,
           token

        })

        }
        else {
            return res.status(400).json({
                message : "Invalid user data"
            })
        }
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal server error"
        })
        
    }

}

 export const logIn = async (req , res) => {
    const {email , password} = req.body;
    if(!email || !password) {
        return res.status(400).json({
            message : "Provide All the fields"
        })

    }
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message : "Invalid credentials"
            })

        }
        const isPasswordMatch = await  bcrypt.compare(password , user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                message : "Invalid credentials"
            })
        }

        const token =await  generateToken(user._id , res)

        return res.status(200).json({
            message : "Successfully logined " ,
            data : user 
        })




        }
        
     catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal server Error"
        })
        
    }
}

export const logOut = async (req , res) => {
    try {
        res.cookie('jwt' , "" ,  {maxAge : 0})
        res.status(201).json({
            message : "Logout Successfully"
        })
        
    } catch (error) {
        
    }

}


 
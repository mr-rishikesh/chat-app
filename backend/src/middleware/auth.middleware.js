import jwt from "jsonwebtoken"
import User from "../models/user.model.js";





export const protectRoute = async (req , res , next) => {
    try {

         const token = req.cookies.jwt

         if(!token) {
            return res.status(400).json({
                message : "User not authenticated - Please provide token"
            })
         }

         const decoded = await jwt.verify(token , process.env.JWT_SECRET);

         if(!decoded) {
            return res.status(400).json({
                message : "User not authenticated - Please provide Valid token"
            })
         }
         const user = await User.findById(decoded.userId).select("-password")

         if(!user) {
            return res.status(400).json({
                message : "User not authenticated - Try again later"
            })
         }
         //  below line is the most important line bcz is set the user in the req at this time 
         // in future if we need the data of the user then we can get from the req.user 
         req.user = user


         next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Internel server error isAuthenticated"
        })

        
        
    }
   
}


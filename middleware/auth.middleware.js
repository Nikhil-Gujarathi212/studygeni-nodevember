
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req , res , next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message : "Unauthorized : no token provided"})
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({ message : "User not found"})
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message : " Unauthorized - no token provided"})
    }
}

export const isAdmin = async (req,res,next)=>{

    console.log(req.user.role)
    if(req.user?.role !== "teacher"){
        return res.status(401).json({
            message : "Access Denied"
        })
    }
    next();
}
import User from "../model/user.model.js"
import jwt from "jsonwebtoken"

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })
}

//signUp Controller
export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        console.log(req.body)   

        if (!username || !password || !email) {
            return res.status(400).json({
                message: "All fields are required!!!!!!"
            })
            }
            const userExist = await User.findOne({ email })
            if (userExist) {
                return res.status(409).json({
                    message: "User already exist!!!!!!"
                })
        }

        const newUser = await User.create({
            username, password, email, role
        })

        const token = generateToken(newUser._id, newUser.role)

        res.status(201).json({
            success: true,
            message: "User created",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            }
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



//Sign In controller
export const login = async (req, res) => { 
  try { 
    const { email, password } = req.body; 
 
    if (!email || !password) { 
      return res.status(400).json({ message: "Email and password are required" }); 
    } 
 
    const user = await User.findOne({ email }).select("+password"); 
    if (!user) { 
      return res.status(401).json({ message: "Invalid email or password" }); 
    } 
 
    const isPasswordCorrect = await user.matchPassword(password); 
    if (!isPasswordCorrect) { 
      return res.status(401).json({ message: "Invalid email or password" }); 
    } 
 
    const token = generateToken(user._id, user.role); 
 
    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
      }, 
    }); 
  } catch (error) { 
    console.error("Login Error:", error); 
res.status(500).json({ message: "Internal Server Error" }); 
} 
}; 

export const getinfo=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"USer Info",
            user
        })
        } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
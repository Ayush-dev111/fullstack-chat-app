import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utilis.js';


export const signup =  async (req,res)=>{
    const { email, fullName, password } = req.body;
    try {
       if(!email || !fullName || !password) {
           return res.status(400).json({ message: "All fields are required" });
       }

       if(password.length < 6){
        return res.status(400).json({message: "password should be atleast 6 characters"});
       }

       const user = await User.findOne({email});

       if(user){
        return res.status(400).json({message: "Email already exists"});
       }
       
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

       const newUser = new User({
        fullName : fullName,
        email : email,
        password : hashedPassword
       })

       if(newUser){
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
        })
       }else{
        res.status(400).json({message: "Invalid user data"});
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login =  async (req,res)=>{
   try {
    const {email, password}= req.body;

   if(!email || !password){
       return res.status(400).json({ message: "All fields are required" });
   }

   const user = await User.findOne({email});
   if(!user){
    return res.status(400).json({message: "User does not exist"});
   }

   const isPasswordMatch = await bcrypt.compare(password, user.password);
   if(!isPasswordMatch){
       return res.status(400).json({message: "Invalid credentials"});
   }

   generateToken(user._id, res);
   res.status(200).json({
    message: "Login successful",
    data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
    }
   })
   } catch (error) {
       console.log(error);
       res.status(500).json({ message: "Internal server error" });
   }

};

export const logout =  (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
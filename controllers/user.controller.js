import {User} from "../model/user.model.js"
import bcrypt from "bcryptjs"       //Bcrypt goes through a multi-step process to turn a password into a long, unrecognizable string of characters.
//1. Salting Bcrypt generates a "salt", which is a random string of characters added to the password
//2. Hashing : a hash uniquely identifies a piece of data but cannot be turned back into that data.
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async(req , res) => {
    try{
        const{fullname,email,phoneNumber,password,role} = req.body;
        
        
        if(!fullname || !email || !phoneNumber || !password || !role){
            
            return res.status(400).json({
                message : "Fill The Information Clearly. Something is missing",
                success : false
            });
        };

        const file = req.file                   //When user uploads an image from frontend amd Multer processes it then And attaches it to req.file
        const fileUri = getDataUri(file)        //👉 This converts the file into a format Cloudinary understands
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message : "User already exist",
                success : false,
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword ,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        })
        return res.status(201).json({
            message : "Account created successfully",
            success : true,
        })
    }
    catch(err){
        console.log("REAL ERROR 👉", err);
        return res.status(400).json({
            message : err.message,
            success : false,
        })
    }

}

export const login = async(req , res) => {
    try{
        const{email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message : "Fill The Information Clearly. Something is missing",
                success : false
            });
        };
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : "Incorrect email or Password",
                success : false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password , user.password);         //Why we use compare because hash is only one sided that it can only create a unique identity of data but cannot convert it back. So to convert it back into real data we use {bcrypt.compare}
        if(!isPasswordMatch){
            return res.status(400).json({
                message : "Incorrect email or Password",
                success : false,
            })
        };
        if(role != user.role){
            return res.status(400).json({
                message : "Account dosen't exist with current role.",
                success : false,
            })
        }

        const tokenData = {
            userId : user._id
        }
        const token = await jwt.sign(tokenData , process.env.SECRET_KEY , { expiresIn: '7d'})
        user = {            //Its like we are creating a new user object a clean and safer one.
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role : user.role,
            profile : user.profile
        }
        
        return res.status(200).cookie("token" , token , { maxAge:7 * 24 *60 *60 *1000 , httpOnly : true , sameSite : 'lax'}).json({         // First token is cookie name while the other is its value.
            message : `Welcome Back ${user.fullname}`,
            user,
            success : true
        })
    }
        catch(err){
            console.log(err)
        }
}

export const logOut = async(req,res) =>{
    try{
        return res.status(200).cookie("token" ,"", {maxAge : 0}).json({     //"":=> replacing token value with empty.   And Setting maxAge to 0 (milliseconds) tells the browser that this cookie is already expired and should be deleted immediately.
            message : "Logged Out successfully",
            success : true
        })
    }
    catch(err){
        console.log(err);
    }
}

export const updateProfile = async(req,res) =>{
    try{
        const {fullname , email , phoneNumber , bio , skills} = req.body
        const file = req.file                   //req.file :- The file user uploaded (image, pdf, etc.) is now available in your request
        const fileUri = getDataUri(file)        //👉 This converts the file into a Data URI (base64 format) cz cloudinary needs path like base64 format.
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)     //👉 This uploads your file to Cloudinary
        
        let skillsArray
        if(skills){
            skillsArray = skills.split(",")   //Multiple skills ko ',' se split karega
        }
          
        const userId = req.id
        let user = await User.findById(userId)
        if(!user){
            return res.status(400).json({
                message : "User Not Found.",
                success : false
            })
        } 

        //Updating data
        if(fullname)user.fullname = fullname 
        if(email)user.email = email
        if(phoneNumber)user.phoneNumber = phoneNumber 
        if(bio)user.profile.bio = bio
        if(skills)user.profile.skills = skillsArray


        // Resume aayega yahan
        if(cloudResponse){      //👉 Check if upload to Cloudinary was successful
            user.profile.resume = cloudResponse.secure_url
            user.profile.resumeOriginalName = file.originalname

        }

        await user.save()

        user = {
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role : user.role,
            profile : user.profile
        }

        return res.status(200).json({
            message : "Profile Updated Successfully.",
            user,
            success : true
        })

    }
    catch(err){
        console.log(err)
    }
}


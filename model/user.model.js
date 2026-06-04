import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phoneNumber : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum:['student' , 'recruiter'],
        required : true
    },
    profile : {
        bio : {type:String},
        skills : [{type : String}],
        resume : {type : String},
        resumeOriginalName : {type : String},
        company : {
            type : mongoose.Schema.Types.ObjectId,      //The Type says: "I am holding an ID."
            ref : 'Company'                             //The Ref says: "That ID belongs to a document in the Company collection."
        },
        profilePhoto : {
            type : String,
            default : ''
        }
    },
},{timestamps : true});         //Timestamp is like hiring an automated secretary to keep track of the clock for you.

const User = mongoose.model("User" , userSchema)
export {User}
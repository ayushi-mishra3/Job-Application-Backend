//Application schema describes the interaction between Role for job and User.
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job',
        required : true
    },
    applicant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type : String,
        enum : ['pending' , 'accepted' , 'rejected'],
        default : 'pending'
    }
} , {timestampsnpm:true});

const Application =  mongoose.model("Application" , applicationSchema)
export default Application
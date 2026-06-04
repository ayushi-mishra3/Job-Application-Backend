//If the user is recruiter , then it will have the authority to give jobs according to his company id.
import mongoose, { mongo } from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    requirements : [{
        type : String
    }],
    salary : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    jobType : {
        type : String,
        required : true
    },
    experienceLevel : {
        type : Number,
        required : true
    },
    position : {                //position : No. of openings
        type : Number,
        required : true
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company',
        required : true
    },
    created_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    applications : [            //It acts like an array , since multiple users who applied for the job by their id's are grouped here.
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Application',
        }
    ]
} ,{timestamps : true});

const Job = mongoose.model("Job" , jobSchema);
export default Job
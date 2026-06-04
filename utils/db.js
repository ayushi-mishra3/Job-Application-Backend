import mongoose from "mongoose"

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected Successfully");
    }
    catch(err){
        console.log("Oops ! some error has occured during the connection with database");
        console.log(err);
    }
}

export default connectDb
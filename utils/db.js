import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        }).then((mongooseInstance) => {
            console.log("Database Connected Successfully");
            return mongooseInstance;
        }).catch((error) => {
            cached.promise = null;
            throw error;
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
};

export default connectDb;
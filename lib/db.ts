import mongoose from "mongoose";

const connectionString = process.env.MONGODB_URI!;

if(!connectionString) {
    throw new Error("MONGODB_URI is not defined,please provide it in .env file")
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {conn: null, promise: null}
}

const connectToDb = async () => {
    if(cached.conn) {
        return cached.conn
    }

    if(!cached.promise) {
        const ops = {
            bufferCommands: true,
            maxPoolSize : 10
        }
        
        cached.promise = mongoose.connect(connectionString, ops).then((mongoose) => {
            return mongoose.connection
        })
    }
    
    try {
        const conn = await cached.promise
        global.mongoose.conn = conn
        return conn
    } catch (error) {
        global.mongoose.promise = null
        throw error
    }
}

export default connectToDb

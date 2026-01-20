import mongoose from "mongoose";
const DB_NAME = "sih2025";

const connectDB = async () => {
    try {
        const mongoURI = `${process.env.MONGODB_URI}/${DB_NAME}`;
        const connectionInstance = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB connected at: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wallet");
      console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  };
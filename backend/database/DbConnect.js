import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDB;

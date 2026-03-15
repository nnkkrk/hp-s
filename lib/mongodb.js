import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, { dbName: "bbtopup" });
  isConnected = true;
  console.log("✅ MongoDB Connected");
};

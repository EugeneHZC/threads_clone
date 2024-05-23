import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return console.log("MONGODBURI not found");
  if (isConnected) return console.log("Already connected to Mongodb");

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("Connected to Mongodb");
  } catch (error) {
    console.log(error);
  }
}

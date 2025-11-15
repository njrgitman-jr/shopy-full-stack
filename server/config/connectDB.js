import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in the .env file");
}

//use async coz database in other contenets may take some time
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to  mongo DB");
  } catch (error) {
    console.log("Mongodb connect error", error);
    process.exit(1); //will stop the server if  database was not conect to mongodb then  server willnot run so stop it
  }
}
export default connectDB;

// const mongoose=require("mongoose")
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.log(error));

import mongoose from "mongoose";
export const connectDB = async () =>{
     await mongoose.connect('mongodb+srv://nishantsinha:nishant01@cluster0.qol1vzt.mongodb.net/food-delievery-app').then(()=>console.log("DB connected"));
}
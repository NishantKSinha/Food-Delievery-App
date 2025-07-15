import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
// Add food item
const addFood = async (req, res) => {
  try {
    // ✅ Validate file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const image_filename = req.file.filename;

    // ✅ Create food item
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    // ✅ Save to DB
    await food.save();

    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//all food list
const listFood = async(req,res)=>{
     try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
     }catch(error){
         console.log(error);
         res.json({success:false,message:"Error"})
     }
}

//remove food item
const removeFood = async(req,res)=>{
      try {
          const food = await foodModel.findById(req.body.id);
          fs.unlink(`uploads/${food.image}`,()=>{})

          await foodModel.findByIdAndDelete(req.body.id);
          res.json({success:true,message:"Food Removed"})
      } catch (error) {
             console.log(error);
             res.json({success:false,message:"Error"})
      }
}

export { addFood ,listFood,removeFood};

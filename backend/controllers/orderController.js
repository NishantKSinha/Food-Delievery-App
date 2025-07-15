import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const { items, amount, address } = req.body;
    const userId = req.body.userId || req.userId; // ✅ Prefer req.userId if using auth middleware

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Save new order to DB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const verifyOrder = async (req,res)=>{
     const {orderId,success} = req.body;

     try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not paid"})
        }
     } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error"})
     }
}

//user order for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId; // prefer req.userId from middleware
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 }); // optional: latest orders first
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//api for updating order status
const updateStatus = async(req,res)=>{
      try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
      } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error"})
      }
}
export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };

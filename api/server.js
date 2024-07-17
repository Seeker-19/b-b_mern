import { connectDB } from "./data/database.js";
import { app } from "./index.js";
import Razorpay from "razorpay";

connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZOR_API_KEY,
  key_secret: process.env.RAZOR_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log("connected express");
});

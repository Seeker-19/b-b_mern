import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },

  checkIn: { type: Date, required: true },

  checkOut: { type: Date, required: true },

  name: { type: String, required: true },

  phone: { type: String, required: true },

  price: Number,

  email: { type: String, required: true },

  booked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Book",
  },

  razorpay_order_id: { type: String, required: true, default: null },

  razorpay_payment_id: { type: String, required: true, default: null },

  razorpay_signature: { type: String, required: true, default: null },
});

export const bookingModel = mongoose.model("Book", bookingSchema);

export const paymentModel = mongoose.model("Payment", paymentSchema);

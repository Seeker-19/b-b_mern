import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  bookingUser,
  getBookings,
  deleteBooking,
  checkOut,
  paymentVerification,
} from "../controllers/book.js";
import { instance } from "../server.js";

const router = express.Router();

router.post("/booking", isAuthenticated, bookingUser);
router.get("/getBookingPlaces", isAuthenticated, getBookings);
// router.post("/", isAuthenticated);
router.post("/checkout", isAuthenticated, checkOut);
router.post("/paymentverification", isAuthenticated, paymentVerification);
router.delete("/deletebooking/:id", isAuthenticated, deleteBooking);

export default router;

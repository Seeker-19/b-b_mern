import ErrorHandler from "../middlewares/errorMiddleware.js";
import { PlaceModel } from "../models/place.js";
import { bookingModel, paymentModel } from "../models/book.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const bookingUser = async (req, res, next) => {
  try {
    const {
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      email,
    } = req.body;

    console.log(email);

    const restplace = await bookingModel.create({
      user: req.user,
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "Place Booked successfully",
      restplace,
    });
  } catch (error) {
    next(error);
  }

  //   const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
  //     req.body;

  //   await bookingModel
  //     .create({
  //       user: req.user,
  //       place,
  //       checkIn,
  //       checkOut,
  //       numberOfGuests,
  //       name,
  //       phone,
  //       price,
  //     })
  //     .then((doc) => {
  //       res.status(201).json({
  //         success: true,
  //         message: "Place Booked successfully",
  //         doc,
  //       });
  //     })
  //     .catch((error) => {
  //       next(error);
  //     });
};

export const getBookings = async (req, res, next) => {
  try {
    const userid = req.user._id;

    const { query } = req.query;

    let bookedPlaces;

    if (query) {
      bookedPlaces = await bookingModel.find({ user: userid }).populate({
        path: "place",
        match: { title: { $regex: query, $options: "i" } },
      });

      bookedPlaces = bookedPlaces.filter((booking) => booking.place !== null);
    } else {
      bookedPlaces = await bookingModel
        .find({ user: userid })
        .populate("place");
    }

    return res.status(201).json({
      success: true,
      bookedPlaces,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedBooking = await bookingModel.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req, res, next) => {
  const { amount } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  console.log(order);

  return res.status(201).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res, next) => {
  //console.log(req.body);

  const { paymentId, orderId, signature } = req.body;
  const { booking_id } = req.headers;
  const { place_id } = req.query;

  console.log("place", place_id, booking_id);

  const hmac = crypto.createHmac("sha256", process.env.RAZOR_API_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");

  console.log(generatedSignature, signature);

  if (generatedSignature === signature) {
    const booked = await paymentModel.find({ booking: booking_id });

    if (!booked) {
      const payment = await paymentModel.create({
        user: req.user,
        place: place_id,
        booking: booking_id,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });
    }

    const booking = await bookingModel.findOneAndUpdate(
      { _id: booking_id },
      { booked: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already booked",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Payment Verification successful",
    });
  }

  return res.status(201).json({
    success: false,
    message: "Payment Verification failed",
  });
};

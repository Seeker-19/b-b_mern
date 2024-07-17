import ErrorHandler from "../middlewares/errorMiddleware.js";
import { PlaceModel } from "../models/place.js";
import { bookingModel } from "../models/book.js";
export const newPlace = async (req, res, next) => {
  try {
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    await PlaceModel.create({
      owner: req.user,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "place added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getPlace = async (req, res, next) => {
  try {
    const userid = req.user._id;
    console.log("user", userid);

    const places = await PlaceModel.find({ owner: userid });

    return res.status(201).json({
      success: true,
      places,
    });
  } catch (error) {
    next(error);
  }
};

export const gotPlaces = async (req, res, next) => {
  try {
    const { id } = req.params;

    const place = await PlaceModel.findById(id);

    if (!place) {
      return next(new ErrorHandler("Invalid id", 404));
    }

    return res.status(201).json({
      success: true,
      place,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    const place = await PlaceModel.findById(id);

    if (!place) {
      return next(new ErrorHandler("Invali id", 404));
    }

    place.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    await place.save();

    res.status(201).json({
      success: true,
      message: "Place updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getallPlaces = async (req, res, next) => {
  try {
    const { query } = req.query;

    let places;
    if (query) {
      // Use regex to make a case-insensitive search
      places = await PlaceModel.find({
        title: { $regex: query, $options: "i" },
      });
    } else {
      places = await PlaceModel.find();
    }

    return res.status(201).json({
      success: true,
      places,
    });
  } catch (error) {
    next(error);
  }
};

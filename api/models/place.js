import mongoose from "mongoose";

const PlaceSchema=new mongoose.Schema({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bnbUser",
    },
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:String,
    checkOut:String,
    maxGuests:Number,
    price:Number

});

export const PlaceModel=mongoose.model("Place",PlaceSchema);


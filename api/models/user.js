import mongoose from "mongoose";

const schema=new mongoose.Schema({

    name:String,

    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{

        type:String,
        required:true
    }
});

export const User=mongoose.model("bnbUser",schema);
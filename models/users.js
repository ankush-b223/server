const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    
    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
    },

    number:{
        type:Number,
        required:true,
        unique:true,
    },

    profilePic:{
        type:String,
    },

    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
    }],

    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    }]



}, {timestamps:true} );


module.exports = mongoose.model("Users",userSchema);
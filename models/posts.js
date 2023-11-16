const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },

    title:{
        type:String,
        required:true,
    },

    media:{
        type:String,
    },

    content:{
        type:String,
    },

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comments",
    }]
    



}, {timestamps:true} );


module.exports = mongoose.model("Posts",postSchema);
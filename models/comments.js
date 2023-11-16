const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true,
    },

    body:{
        type:String,
        required:true,
    },

    commentlikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    }],

    replies:[{
        type:mongoose.Types.ObjectId,
        ref:"Comments",
        default:[],
    }],

    isReply:{
        type: Boolean,
        default: false
    }


}, {timestamps:true} );


module.exports = mongoose.model("Comments",commentSchema);
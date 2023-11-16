const Comment = require("../models/comments");
const Post = require("../models/posts");


const createComment = async(req,res)=>{
 //edit in comment model so check this controller
    try{

        const payload = req.user;
        console.log("payload",payload);
        const postId = req.params.postId;
        let {body,isReply} = req.body;

        if(!isReply || isReply === null){
            isReply = false;
        }

        if(!body || !postId){
            return res.status(400).json({
                success:false,
                message:"Missing fields",
            })
        }

        const newComment = await Comment.create({
            userId:payload.userId,
            postId:postId,
            body:body,
            isReply,
        });

        const attachToPost = await Post.findByIdAndUpdate(postId , 
            { $push:{comments:newComment._id} } , {new:true} 
        ).populate("comments").exec();

        console.log("Attached to post in create comment-> "  ,attachToPost);
        if(attachToPost === null){

            const deleteComment = await Comment.findByIdAndDelete(newComment._id);

            return res.status(400).json({
                success:false,
                message:"No such post found",
            })
        };

        //there may be a need to get updated post object with new comment added & populated

        res.status(200).json({
            success:true,
            data:newComment,
            message:`New post comment added by ${payload.username}`,
        })
        



    }catch(err){
        console.log("Err in creating new comment flow-> " , err);
        res.status(500).json({
            success:false,
            message:"Something went wrong, try again!",
        })

    }
};



//create comment like


//reply to a comment


//delete comment






//edit an existing comment




module.exports = {
    createComment,
}
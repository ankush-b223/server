const Post = require("../models/posts");

const likePost = async(req,res)=>{


    try{

        //validations req like checking whether post exists or not 

        const postId = req.params.id;
        const payload  = req.user;

        const post = await Post.findByIdAndUpdate(postId ,
             { $addToSet:{likes:payload.userId} } , {new:true} 
        );

        if(post){
            return res.status(200).json({
                success:true,
                message:`${post.title} has been liked by ${payload.username}!`,
            })
        }

        res.status(400).json({
            success:false,
            message:"No post with such postId found!",
        })


    }catch(err){
        console.log("Error in liking post flow-> " , err);
        res.status(500).json({
            success:false,
            message:"Something went wrong",
        })

    }
};


const unlikePost = async(req,res)=>{


    try{

        const postId = req.params.id;
        const payload  = req.user;

        const post = await Post.findByIdAndUpdate(postId ,
             { $pull:{likes:payload.userId} } , {new:true} 
        );

        if(post){
            return res.status(200).json({
                success:true,
                message:`${post.title} has been unliked by ${payload.username}!`,
            });

        }
        

        res.status(400).json({
            success:false,
            message:"No post with such postId found!",
        })




    }catch(err){
        console.log("Error in unliking post flow-> " , err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })

    }
};


module.exports = {
    likePost,
    unlikePost,
}
const User = require("../models/users");
const Post = require("../models/posts");

const {isSupported,cloudinaryUpload} = require("./authentication");

const newPost = async(req,res)=>{

    try{

        //fetching details
        const payload = req.user;

        const {title,content} = req.body;

        const file = ( req.files && req.files.media ) ? (req.files.media):(null); 

        
        //global for media link
        let mediaLink = null;

        //if file exists -> upload to cloudinary -> link url to mediaLink var
        if(file){

            //file-processing + cloudinary push & link fetching
            const extension = file.name.split(".",)[1];
            //supported types
            const supportedTypes = ["jpg","jpeg","png","mp4","mp3"];

            //isSupported?
            const supported = isSupported(extension,supportedTypes);

            if(!supported){
                return res.status(400).json({
                    success:false,
                    message:"File type for Profile Picture not supported , try uploading jpg,jpeg,png",
                })
            }

            //result obj will return secure_url
            const result = await cloudinaryUpload(file,"socialMediaApp");

            mediaLink = result.secure_url;

        }

        //create post
        const createdPost = await Post.create({

                userId:payload.userId,
                title:title,
                content:content,
                media: (mediaLink != null) ? (mediaLink) : "",
                

        });
        
        //attach to User.posts
        try{
            
            const updateUser = await User.findByIdAndUpdate(payload.userId ,
                {$push:{posts:createdPost._id} } , {new:true}
            );

        }catch(err){
            console.log("error in attaching post to user->", err);
            return res.status(500).json({
                success:false,
                message:"Something went wrong while attaching",
            })

        }
       
        //response
        res.status(200).json({
            success:true,
            data:createdPost,
            message:`New post pushed by ${payload.username}!`,
        })




    }catch(err){

        console.log("error in creating a new post flow -> ", err)
        res.status(500).json({
            success:false,
            message:"Something went wrong!",
        })

    }
};



const getPosts = async(req,res)=>{


    try{

        const data = await Post.find();
       
        const postsWithLikeCount = data.map((post) => {

            const likeCount = post.likes.length;
            //to jSObject
            const plainPost = post.toObject();
            // Add the likeCount property to the plain JavaScript object
            plainPost.likeCount = likeCount;

            return plainPost;
        });
        
        res.status(200).json({
            success:true,
            data:postsWithLikeCount,
            message:"Feed refreshed!",

        })



    }catch(err){

        console.log("Error in get posts flow -> ", err);
        res.status(500).json({
            success:false,
            message:"Something went wrong , try again!",
        })

    }
}


module.exports = {
    newPost,
    getPosts,
}
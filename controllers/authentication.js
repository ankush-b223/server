const User = require("../models/users");

require("dotenv").config();

const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

//supporting functions 

//is file supported? fn
const isSupported = (extension , supportedTypes)=>{
    if(supportedTypes.includes(extension)){
        return true;
    }else{
        return false;
    }
}

//cloudinary upload
const cloudinaryUpload = async(file , folder)=>{
    //folder into options
    const options = {folder};
    //req config to upload videos -> resource_type
    options.resource_type = "auto"; 

    //upload
    return await cloudinary.v2.uploader.upload(file.tempFilePath , options);
}






const signup = async(req,res)=>{

    try{

        const {name,email,password,number} = req.body;
        const file = req.files.profilePic;
        
        //add otp validation in future

        //email & number uniqueness validation
        const checkEmail = await User.findOne({
            email:email
        });
        if(checkEmail){
            console.log("User found with same email id ->" , checkEmail);
            return res.status(400).json({
                success:false,
                message:"User with given email exists",
            })
        };

        
        const checkNumber = await User.findOne({
            number:number,
        });
        if(checkNumber){
            return res.status(400).json({
                success:false,
                message:"User with given phone number exists",
            })
        };

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        //file-processing + cloudinary push & link fetching
        const extension = file.name.split(".",)[1];
        //supported types
        const supportedTypes = ["jpg","jpeg","png"];

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

        const picLink = result.secure_url;


        //unique new user
        const newUser = await User.create({

            name:name,
            email:email,
            password:hashedPassword,
            number:number,
            profilePic:picLink,

        })

        //if newUser is null -> no user created
        if(!newUser){
            return res.status(500).json({
                success:false,
                error:"Error in user creation in DB",
                message:"User creation failed , please try again!"
            })
        }


        res.status(200).json({
            success:true,
            data:newUser,
            message:"User created successfully",            
        })
        

    }catch(err){
        console.log("Error in signup flow-> " , err);

        res.status(500).json({
            success:false,
            message:"Something went wrong , Try again",
        })

    }
};



const login = async(req,res)=>{


    try{

        const {email,password} = req.body;

        const user = await User.findOne({
            email:email,
        })

        if(!user){
            return res.staus(400).json({
                success:false,
                message:"User with given credentials doesn't exist , Sign Up!",
            })
        };

        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials",
            })  
        };

        //credentials validated

        //jwt
        const payload = {
            userId: user._id,
            username: user.name,
            profilePic: user.profilePic,
        }

        const token = jwt.sign(payload , process.env.JWT_SECRET , {
            expiresIn:"2h",
        });



        //cookies options
        const cookieOptions = {
            expires: new Date( Date.now() + 1 * 2 * 60 * 60 * 1000),
            httpOnly:true,
        }

        res.cookie("token" , token , cookieOptions).status(200).json({
            success:true,
            message:`Welcome Back ${user.name}!`,
        });



    }catch(err){
        console.log("Error in login flow-> " , err);

        res.status(500).json({
            success:false,
            message:"Something went wrong , Try again",
        })


    }
};




module.exports = {
    signup,
    login,
    isSupported,
    cloudinaryUpload,
}
const jwt = require("jsonwebtoken");

require("dotenv").config();

const auth = async(req,res,next)=>{

    try{
        
        const token = req.cookies.token;

        if(!token || token === undefined){
            return res.status(400).json({
                success:false,
                message:"Token missing , Login Please!",
            })
        }

        try{

            const payload = jwt.verify(token , process.env.JWT_SECRET );

            req.user = payload;

        }catch(err){
            return res.status(400).json({
                success:false,
                message:"Invalid token , login again!", 
            })
        };
        

        next();

    }catch(err){
        console.log("Error in auth middleware");

        res.status(500).json({
            success:false,
            message:"Something went wrong , try again!",
        })

    }

}




module.exports  = {
    auth,
}
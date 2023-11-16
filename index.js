//dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRouter= require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const cloudinaryConnect = require("./config/cloudinary");
const dbConnect = require("./config/database");

//app instantiation
const app = express();

//middlewares
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cookieParser());




//routes mounting
app.use("/api/v1/user" , userRouter);
app.use("/api/v1/post",postRouter);


const PORT = process.env.PORT || 5001;

app.get("/",(req,res)=>{
    res.status(200).send("Server is Up");
})

app.listen(PORT , ()=>{
    dbConnect();
    cloudinaryConnect();
    console.log(`Server is up at ${PORT}`);
})
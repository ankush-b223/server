const mongoose = require("mongoose");

const dbConnect = async ()=>{
    mongoose.connect(process.env.MONGO_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then( ()=>{
        console.log("DB connected!");
    }).catch(error =>{
        console.log("Error in DB Connection-->",error);
    } )
};


module.exports = dbConnect;
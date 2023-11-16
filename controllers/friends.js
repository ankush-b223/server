const User  = require("../models/users");


const addFriend = async(req,res)=>{

    try{

        const payload = req.user;
        const friendId = req.params.id;

        const friend = await User.findById(friendId);

        //insert validations like if already friends

        if(friend === null){
            return res.status(400).json({
                success:false,
                message:"No user exists with such id",
            })
        };

        const attachFriend = await User.findByIdAndUpdate(payload.userId ,
            {$push: {friends:friend._id} } , {new:true}
        );

        res.status(200).json({
            success:true,
            message:`${friend.name} has been added to your friendList, ${payload.username}!`,
        })






    }catch(err){
        console.log("Error in adding a friend flow -> " ,err);
        res.status(500).json({
            success:false,
            message:"Something went wrong , try again!",
        })

    }
};

//get Friends List for an user
const getFriends = async(req,res)=>{

    try{

        const payload = req.user;

        const user = await User.findById(payload.userId).populate("friends").exec();

        if(user===null){
            return res.status(400).json({
                success:false,
                message:"No such user exists , try again!",
            })
        };


        const friends = user.friends;

        //removing password field for sending objects in response
        const sanitizedFriends = friends.map(friend => {
            const { password, ...sanitizedFriend } = friend._doc;
            return sanitizedFriend;
          });

        res.status(200).json({
            success:true,
            data:sanitizedFriends,
            message:"Here is the friendList!",
        })
        
    }catch(err){
        console.log("error in fetching friendList flow -> " , err);
        res.status(500).json({
            success:false,
            message:"Something went wrong , try again!",
        });

    }
};

//remove friend


module.exports = {
    addFriend,
    getFriends,
};
const express= require("express");

const router = express.Router();

//fetch controllers
const {signup, login} = require("../controllers/authentication");
const { auth } = require("../middlewares/auth");
const { addFriend, getFriends } = require("../controllers/friends");
const { getPosts } = require("../controllers/post");

//routes + mappings

router.post("/signup", signup);
router.post("/login",login);

//protected route (only for logged in users)
router.get("/dashboard" , auth , getPosts);


//friends
router.post("/addFriend/:id", auth ,addFriend);
router.get("/getFriends" , auth, getFriends);


module.exports = router;
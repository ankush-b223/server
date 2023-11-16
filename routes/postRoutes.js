const express = require("express");

const router = express.Router();

const { auth } = require("../middlewares/auth");

const {newPost, getPosts} = require("../controllers/post");
const { likePost, unlikePost } = require("../controllers/like");
const { createComment } = require("../controllers/comment");



router.post("/newPost" ,auth, newPost); 
router.get("/getPosts" , auth, getPosts);

router.post("/like/:id" , auth , likePost);
router.post("/unlike/:id" , auth , unlikePost);

router.post("/createComment/:postId" , auth , createComment);





module.exports = router;
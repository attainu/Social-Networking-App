let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let accountOwner = require("../middleware/accountOwner");
let { createPost, deletePost, updatePost, getAllPosts, likeUnlikePost } = require("../controllers/postControllers");
let upload = require("../utils/multer")


router.get("/getAllPosts", authenticate, getAllPosts);
router.post("/createPost", authenticate, upload.single("fileName"), createPost);
router.post("/likeUnlikePost/:postId", authenticate, likeUnlikePost);
router.put("/updatePost/:postId", authenticate, accountOwner, updatePost);
router.delete("/deletePost/:postId", authenticate, accountOwner, deletePost);


module.exports = router;
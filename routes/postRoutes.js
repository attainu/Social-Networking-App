let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let { createPost, deletePost, updatePost, getPost, likeUnlikePost} = require("../controllers/postControllers");
let upload = require("../utils/multer")


router.get("/getPosts", authenticate, getPost);
router.post("/createPost", authenticate, upload.single("fileName"), createPost);
router.post("/likeUnlikePost/:postId", authenticate, likeUnlikePost);
router.put("/updatePost/:postId", authenticate, updatePost);
router.delete("/deletePost/:postId", authenticate, deletePost);




module.exports = router;
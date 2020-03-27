let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let { createPost , deletePost, updatePost} = require("../controllers/postControllers");
let upload = require("../utils/multer")



router.post("/createPost",authenticate,upload.single("fileName"),createPost);
router.patch("/updatePost/:postId",authenticate,updatePost);
router.delete("/deletePost/:postId",authenticate,deletePost);




module.exports = router;
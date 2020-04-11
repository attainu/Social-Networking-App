let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let accountOwner = require("../middleware/accountOwner");
let { createComment , deleteComment, updateComment } = require("../controllers/commentControllers");


router.post("/createComment/:postId",authenticate,createComment);
router.put("/updateComment/:commentId",authenticate,accountOwner,updateComment);
router.post("/deleteComment/:commentId",authenticate,accountOwner,deleteComment);




module.exports = router;
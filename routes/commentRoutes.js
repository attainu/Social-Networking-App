let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let { createComment , deleteComment, updateComment } = require("../controllers/commentControllers");


router.post("/createComment/:postId",authenticate,createComment);
router.put("/updateComment/:commentId",authenticate,updateComment);
router.delete("/deleteComment/:commentId",authenticate,deleteComment);




module.exports = router;
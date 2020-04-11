let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let { sendMessage ,  getInbox} = require("../controllers/inboxControllers");


router.post("/sendMessage/:sendTo", authenticate,sendMessage);
router.get("/getInbox", authenticate,getInbox);



module.exports = router;
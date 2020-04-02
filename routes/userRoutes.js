let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate")
let { register, login, logout,confirmEmail,sendForgotPasswordMail
    ,resetPassword ,sendRequest,acceptRequest} = require("../controllers/userControllers");


router.get("/confirmEmail/:confirmToken",confirmEmail);
router.get("/forgotPasswordMail",sendForgotPasswordMail);
router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword",resetPassword);
router.delete("/logout",authenticate, logout);
router.get("/sendRequest/:requestUserId",authenticate,sendRequest);
router.get("/acceptRequest/:acceptUserId",authenticate,acceptRequest)



module.exports = router;
let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate")
let { register, login, logout,confirmEmail,sendForgotPasswordMail,resetPassword } = require("../controllers/userControllers");


router.get("/confirmEmail/:confirmToken",confirmEmail)
router.post("/register", register);
router.post("/login", login);
router.delete("/logout",authenticate, logout);
router.post("/forgotPasswordMail",sendForgotPasswordMail);
router.post("/resetPassword/:confirmToken",resetPassword)


module.exports = router;
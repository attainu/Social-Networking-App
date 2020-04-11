let express = require("express");
let router = express.Router();
let authenticate = require("../middleware/authenticate");
let upload = require("../utils/multer")
let { register, login, logout, confirmEmail, sendForgotPasswordMail
    , resetPassword, sendRequest, acceptRequest, deleteUser,uploadProfilePicture,getAllUsers } = require("../controllers/userControllers");

router.get("/confirmEmail/:confirmToken", confirmEmail);
router.get("/forgotPasswordMail", sendForgotPasswordMail);
router.get("/sendRequest/:requestUserId", authenticate, sendRequest);
router.get("/acceptRequest/:acceptUserId", authenticate, acceptRequest);
router.get("/getAllUsers",authenticate,getAllUsers)
router.put("/resetPassword", resetPassword);
router.post("/register", register);
router.post("/login", login);
router.post("/uploadProfilePicture",authenticate,upload.single("fileName"),uploadProfilePicture);
router.delete("/logout", authenticate, logout);
router.delete("/deleteAccount", authenticate, deleteUser);

module.exports = router;
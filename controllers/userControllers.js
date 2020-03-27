let { hash, compare } = require("bcryptjs");
let User = require("../models/User");
let { sign, verify } = require("jsonwebtoken");
let sendMail = require("../utils/generateEmail")

module.exports = {
    register: async (req, res) => {
        try {
            var user = req.body
            let currentUser = new User({ ...user });
            let hashedPassword = await hash(currentUser.password, 10);
            currentUser.password = hashedPassword;
            let token = sign({ payload: currentUser._id }, process.env.PRIVATE_KEY);
            let confirmEmailToken = sign({ payload: currentUser._id }, process.env.CONFIRM_EMAIL_KEY)
            currentUser.confirmToken = confirmEmailToken
            currentUser.token = token
            await currentUser.save();
            await sendMail(currentUser.email, confirmEmailToken, "email")
            return res.json("Confirm your email");
        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    },
    confirmEmail: async (req, res) => {
        try {
            let header = req.params.confirmToken;
            if (!header) {
                throw new Error("NO ACCESS TOKEN")
            }
            let currentUser = await User.findOne({ confirmToken: header });
            if (currentUser === undefined) throw new Error("INVALID ACCESS TOKEN")
            let payload = verify(header, process.env.CONFIRM_EMAIL_KEY);
            if (payload) {
                currentUser.isConfirm = true;
                currentUser = await currentUser.save();
                res.json(currentUser)
            }
        }
        catch (error) {
            return res.status(500).json({ Error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            let currentUser = await User.findOne({ email: req.body.email });
            if (currentUser === undefined) throw new Error("Incorrect Email")
            let checkpassword = await compare(req.body.password, currentUser.password);
            if (checkpassword) {
                let token = sign({ payload: currentUser._id }, process.env.PRIVATE_KEY);
                currentUser.token = token
                await currentUser.save()
                return res.json(currentUser);
            }
            else throw new Error("Incorrect Password")

        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    },
    logout: async (req, res) => {
        try {
            let userToken = req.header("Authorization");
            let currentUser = await User.findOne({ token: userToken });
            if (currentUser === undefined) throw new Error("Invalid Access Token")
            else {
                currentUser.token = null;
                currentUser.save()
            }
            res.status(200).json("Done")
        }
        catch (error) {
            return res.send(error.message)
        }
    },
    sendForgotPasswordMail: async (req, res) => {
        try {
            let email = req.body.email
            let user = await User.findOne({ email })
            if (user) {
                let token = sign({ payload: user._id }, process.env.PRIVATE_KEY);
                user.confirmToken = token
                await user.save()
                await sendMail(email, token)
                res.send("Check Your Email to reset password")
            }
        }
        catch (error) {
            res.send(error.message)
        }
    },
    resetPassword: async (req, res) => {
        try {
            let password = req.body.password;
            let token = req.params.confirmToken;
            let user = await User.findOne({ confirmToken: token })
            if (user) {
                let hashedPassword = await hash(password, 10);
                user.password = hashedPassword;
                await user.save()
                res.send("Password Changed")
            }
        } catch (error) {
            res.send(error.message)
        }
    }
}

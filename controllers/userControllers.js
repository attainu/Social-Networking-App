let { hash, compare } = require("bcryptjs");
let { sign, verify } = require("jsonwebtoken");
let sendMail = require("../utils/generateEmail")
let User = require("../models/User");

module.exports = {
    register: async (req, res) => {
        try {
            let user = req.body
            let currentUser = new User({ ...user });
            let hashedPassword = await hash(currentUser.password, 10);
            currentUser.password = hashedPassword;
            // let token = sign({ payload: currentUser._id }, process.env.PRIVATE_KEY);
            let confirmEmailToken = sign({ payload: currentUser._id }, process.env.CONFIRM_EMAIL_KEY)
            currentUser.confirmToken = confirmEmailToken
            // currentUser.token = token
            await currentUser.save();
            await sendMail(currentUser.email, confirmEmailToken, "email")
            return res.json("done");
        }
        catch (error) {
            return res.status(500).send(error.message)
        }
    }
    ,
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
            return res.status(500).send(error.message);
        }
    },
    logout: async (req, res) => {
        try {
            let userToken = req.header("Authorization");
            let currentUser = await User.findOne({ token: userToken });
            if (currentUser === undefined) throw new Error("Invalid Access Token");
            else {
                currentUser.token = null;
                currentUser.save()
            }
            res.status(200).json("Done");
        }
        catch (error) {
            return res.send(error.message);
        }
    },
    sendForgotPasswordMail: async (req, res) => {
        try {
            let email = req.body.email;
            let user = await User.findOne({ email });
            if (user) {
                let token = Math.floor(1000 + Math.random() * 9000);
                user.confirmToken = token;
                await user.save();
                await sendMail(email, token);
                res.send("Check Your Email to reset password");
            }
        }
        catch (error) {
            res.send(error.message)
        }
    },
    resetPassword: async (req, res) => {
        try {
            let otp = req.body.otp;
            let newPassword = req.body.password;
            let user = await User.findOne({ confirmToken: otp });
            if (user) {
                let hashedPassword = await hash(newPassword, 10);
                user.password = hashedPassword;
                user.confirmToken = null;
                await user.save();
                res.send("Password Updated");
            }
        } catch (error) {
            res.send(error.message)
        }
    },
    sendRequest: async (req,res) => {
        try {
            let userId = req.user._id;
            let requestUserId = req.params.requestUserId;
            let user = await User.findOne({_id:userId})
            let requestUser = await User.findOne({_id:requestUserId});
            
            requestUser.receivedRequests.push(userId);
            user.sentRequests.push(requestUserId);
            await requestUser.save();
            await user.save()
            res.send("done");
        } catch (error) {
            return res.send(error.message)
        }
    },
    acceptRequest:async (req,res) => {
        try {
            let userId = req.user._id;
            let acceptUserId = req.params.acceptUserId;
            let user =await User.findOne({_id:userId});
            let acceptUser = await User.findOne({_id:acceptUserId});
            // let acceptRequest = user.receivedRequests.find((u) =>{ u._id == acceptUserId; return u})
            // acceptRequest.isAccepted = true;
            let sentRequest = acceptUser.sentRequests.find((u) =>{ u._id == userId; return u})
            sentRequest.isAccepted = true;
            user.friends.push(acceptUserId);
            acceptUser.friends.push(userId);
            await user.save();
            await acceptUser.save();
            return res.send("done")

        } catch (error) {
            return res.send(error.message)
        }
    }
}

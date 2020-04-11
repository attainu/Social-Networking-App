let { hash, compare } = require("bcryptjs");
let { sign, verify } = require("jsonwebtoken");
let sendMail = require("../utils/generateEmail")
let User = require("../models/User");
let Post = require("../models/Post");
let bufferConversion = require("../utils/bufferConversion");
let cloudinary = require("../utils/cloudinary");

module.exports = {
    register: async (req, res) => {
        try {
            let user = req.body;
            const userCheck = await User.findOne({ email: user.email })
            if (userCheck)
                return res.status(403).json({ message: "This email already exist" })
            let currentUser = new User({ ...user });
            let hashedPassword = await hash(currentUser.password, 10);
            currentUser.password = hashedPassword;
            let confirmEmailToken = sign({ payload: currentUser._id }, process.env.CONFIRM_EMAIL_KEY);
            currentUser.confirmToken = confirmEmailToken;
            await currentUser.save();
            await sendMail(currentUser.email, confirmEmailToken, "email");
            return res.status(201).json("CONFIRM YOUR EMAIL");
        }
        catch (error) {
            return res.status(500).json(error.message)
        }
    }
    ,
    confirmEmail: async (req, res) => {
        try {
            let header = req.params.confirmToken;
            if (!header) return res.status(401).json({ message: "NO ACCESS TOKEN , UNAUTHORIZED" })
            let currentUser = await User.findOne({ confirmToken: header });
            if (!currentUser) res.status(404).json({ message: "INVALD ACCESS TOKEN" })
            let payload = verify(header, process.env.CONFIRM_EMAIL_KEY);
            if (payload) {
                currentUser.isConfirm = true;
                currentUser.confirmToken = null;
                currentUser = await currentUser.save();
                return res.status(202).send("<h1>Congratulations !!! Your Email has been confirmed</h1>")
            }
            return res.status(401).json({ message: "TOKEN HAS BEEN EXPIRED" })
        }
        catch (error) {
            return res.status(500).json({ Error: error.message })
        }
    },
    login: async (req, res) => {
        try {
            let currentUser = await User.findOne({ email: req.body.email }).populate("friends", ["name", "profilePicture", "city"]);
            if (!currentUser) return res.status(404).json({ message: "Invalid Credentials" })
            let checkpassword = await compare(req.body.password, currentUser.password);
            if (checkpassword) {
                let token = sign({ payload: currentUser._id }, process.env.PRIVATE_KEY);
                currentUser.token = token
                await currentUser.save()
                return res.status(202).json(currentUser.toJSON());
            }
            return res.status(401).json({ message: "Invalid Credentials" })

        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    },
    uploadProfilePicture: async (req, res) => {
        try {
            let currentUser = req.user;
            let userProPic = bufferConversion(
                req.file.originalname,
                req.file.buffer
            );
            let imgResponse = await cloudinary.uploader.upload(userProPic);
            currentUser.profilePicture = imgResponse.secure_url;
            await currentUser.save();
            return res.status(200).json("Uploaded Successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    logout: async (req, res) => {
        try {
            let currentUser = req.user;
            currentUser.token = null;
            currentUser.save();
            return res.status(200).json("SUCCESS");
        }
        catch (error) {
            return res.status(500).json(error.message);
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
                return res.status(200).json("OTP HAS BEEN SENT TO YOUR EMAIL");
            }
            return res.status(404).json({ message: "USER NOT FOUND" })
        }
        catch (error) {
            return res.status(500).json(error.message)
        }
    },
    resetPassword: async (req, res) => {
        try {
            let { otp, email, password } = req.body;
            let user = await User.findOne({ email: email });
            if (!user) return res.status(404).json({ message: "USER NOT FOUND" })
            else if (user.confirmToken === otp) {
                let hashedPassword = await hash(password, 10);
                user.password = hashedPassword;
                user.confirmToken = null;
                await user.save();
                return res.status(200).json("SUCCESS");
            }
            else return res.status(401).json({ message: "INVALID OTP" })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    sendRequest: async (req, res) => {
        try {
            let currentUser = req.user;
            let requestUserId = req.params.requestUserId;
            let requestUser = await User.findOne({ _id: requestUserId });
            let sentRequest = currentUser.sentRequests.find((u) => { u._id == requestUserId._id; return u });
            if (!requestUser) res.status(404).json({ message: "USER NOT FOUND" })
            else if (!sentRequest) {
                requestUser.receivedRequests.push(currentUser);
                currentUser.sentRequests.push(requestUserId);
                await requestUser.save();
                await currentUser.save();
                return res.status(200).json("SUCCESS");
            }
            else return res.status(208).json("Friend Request is sent already")
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    acceptRequest: async (req, res) => {
        try {
            let currentUser = req.user;
            let acceptUserId = req.params.acceptUserId;
            let acceptUser = await User.findOne({ _id: acceptUserId });
            if (!acceptUser) res.status(404).json({ message: "USER NOT FOUND" })
            let acceptRequest = currentUser.receivedRequests.find((u) => { u._id == acceptUserId; return u });
            if (acceptRequest.isAccepted === true) return res.status(208).json("ALREADY YOU HAVE SENT FRIEND REQUEST")
            else {
                acceptRequest.isAccepted = true;
                let sentRequest = acceptUser.sentRequests.find((u) => { u._id == currentUser._id; return u })
                sentRequest.isAccepted = true;
                currentUser.friends.push(acceptUserId);
                acceptUser.friends.push(currentUser._id);
                await currentUser.save();
                await acceptUser.save();
                return res.status(200).json("SUCCESS")
            }
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    deleteUser: async (req, res) => {
        try {
            let currentUser = req.user;
            let users = await User.find({});
            for (let i = 0; i < users.length; i++) {
                let currentUserIndex = users[i].friends.indexOf(currentUser._id)
                let sentReqIndex = users[i].sentRequests.findIndex((u) => u._id == currentUser._id)
                let recReqIndex = users[i].receivedRequests.findIndex((u) => u._id == currentUser._id)
                if (currentUserIndex !== -1) {
                    users[i].friends.splice(currentUserIndex, 1)
                    await users[i].save()
                }
                if (sentReqIndex !== -1) {
                    users[i].sentRequests.splice(currentUserIndex, 1)
                    await users[i].save()
                }
                if (recReqIndex !== -1) {
                    users[i].receivedRequests.splice(currentUserIndex, 1)
                    await users[i].save()
                }
            }
            await User.findByIdAndDelete({ _id: currentUser._id });
            await Post.deleteMany({ user: currentUser._id }).populate("comment");
            return res.status(200).json("SUCCESS");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find({})
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

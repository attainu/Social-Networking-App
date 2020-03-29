let User = require("../models/User");
let { verify } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        console.log(req.body)
        let authHeader = req.header("Authorization");
        if (!authHeader) {
            throw new Error("NO ACCESS TOKEN")
        }
        let currentUser = await User.findOne({ token: authHeader });
        if (currentUser === undefined) {
            throw new Error("INVALID ACCESS TOKEN")
        }
        if(currentUser.isConfirm){
            verify(authHeader, process.env.PRIVATE_KEY, (err) => {
                if (err) {
                    return res.json(err.message)
                } else {
                    req.user = currentUser;
                    next()
                }
            })
        }
        else{
            throw new Error("Confirm your email first")
        }
    }
    catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}
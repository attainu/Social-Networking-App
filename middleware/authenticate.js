let User = require("../models/User");
let { verify } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        let authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({message:"NO ACCESS TOKEN"})
        let currentUser = await User.findOne({ token: authHeader });
        if (!currentUser ) return res.status(401).json({message:"NO ACCESS TOKEN"})
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
            res.status(401).json({message:"Email not confirmed"})
        }
    }
    catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}
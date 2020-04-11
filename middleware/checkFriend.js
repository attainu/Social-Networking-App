let User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        let user = req.user;
        
    }
    catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}
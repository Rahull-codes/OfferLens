const jwt = require("jsonwebtoken");
const tokenblacklistModel = require("../model/blacklist.model");

async function Authuser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    const isBlacklisted = await tokenblacklistModel.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Token is Inavalid"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token or token expired" });
    }

}

module.exports = { Authuser };

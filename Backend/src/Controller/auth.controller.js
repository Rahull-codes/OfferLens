const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

/**
 * @name registerUsercontroller
 * @description register a new user, expects username, email and password
 * @access public
 */

async function registerUsercontroller(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.cookie("token", token, cookieOptions);

    res
        .status(201)
        .json({ message: "User created successfully", user: { id: user._id, user: user.username, email: user.email } });
}

/**
 * @name loginUsercontroller
 * @description login a user, expects email and password
 * @access public
 */

async function loginUsercontroller(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.cookie("token", token, cookieOptions);

    res.status(200).json({ message: "Login successful", user: { id: user._id, user: user.username, email: user.email } });

}

/**
 * @name logoutUsercontroller
 * @description logout a user by blacklisting the token
 * @access public
 */

async function logoutUsercontroller(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    await blacklistModel.create({ token });
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout successful" });
}

/**
 * @name getmecontroller
 * @description get the user details
 * @access private
 */

async function getmecontroller(req, res) {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {
    registerUsercontroller,
    loginUsercontroller,
    logoutUsercontroller,
    getmecontroller
};

const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token
}

module.exports = generateToken
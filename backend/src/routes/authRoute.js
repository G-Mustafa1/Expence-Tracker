const express = require('express')
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const protect = require('../middleware/auth');
const { User } = require('../models/Users');
const { upload } = require('../config/cloudniry');

authRouter.post("/register", upload.single('profileImg'), async (req, res) => {
    const { fullName, emailAddress, password } = req.body;
    const profileImg = req.file ? req.file.path : undefined; // optional image
    try {
        if (!fullName || !emailAddress || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        if (!validator.isEmail(emailAddress)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be strong (uppercase, lowercase, number, symbol, 8+ characters)",
            });
        }

        const existingUser = await User.findOne({ emailAddress });
        if (existingUser)
            return res.status(400).json({ success: false, message: "User already exists with this email" });

        const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_PASS));

        const user = await User.create({
            fullName,
            emailAddress,
            password: hashedPassword,
            profileImg
        });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // ✅ COOKIE SETTINGS (Vercel Ready)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({
            id: user._id,
            user,
            message: "Signup Successful",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        if (!emailAddress)
            return res.status(400).json({ success: false, message: "Enter your Email Address" });
        if (!password)
            return res.status(400).json({ success: false, message: "Enter your Password" });

        const user = await User.findOne({ emailAddress }).select("+password");
        if (!user)
            return res.status(400).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        // ✅ Use 'user' instead of 'newUser'
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });


        res.status(200).json({
            success: true,
            message: "Login Successful",
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

authRouter.get('/userInfo', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            // isLogin: true,
            user: user
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

authRouter.post('/logout', (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).send({ error: 'Error during logout', message: error.message });
    }
});



module.exports = {
    authRouter
}



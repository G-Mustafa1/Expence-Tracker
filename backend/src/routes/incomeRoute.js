const Income = require("../models/Income")
const express = require('express');
const incomeRouter = express.Router();
const xlsx = require("xlsx");
const protect = require("../middleware/auth");

incomeRouter.post("/add-income", protect, async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        const { icon, source, amount, date } = req.body;
        if (!icon || !source || !amount) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const income = await Income.create({
            userId,
            icon,
            source,
            amount,
            date
        });

        res.status(201).json({
            success: true,
            message: "Income added Successful",
            income,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

incomeRouter.get("/get-income", protect, async (req, res) => {
    const userId = req.user?._id;

    try {
        const incomes = await Income.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

incomeRouter.delete("/delete-income/:id", protect, async (req, res) => {
    console.log(req.params.id);
    try {
        const deletedIncome = await Income.findByIdAndDelete(req.params.id)
        res.json({deletedIncome, message: "Income Deleted Successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = incomeRouter
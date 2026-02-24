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
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { month, year } = req.query;

        let filter = {
            userId: userId, // 🔒 sirf logged-in user ke income
        };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);

            filter.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        const incomes = await Income.find(filter).sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: incomes,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

incomeRouter.delete("/delete-income/:id", protect, async (req, res) => {
    try {
        const deletedIncome = await Income.findByIdAndDelete(req.params.id)
        res.json(deletedIncome)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = incomeRouter
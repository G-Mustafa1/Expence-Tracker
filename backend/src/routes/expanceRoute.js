const express = require("express");
const Expense = require("../models/Expance");
const protect = require("../middleware/auth");
const expenseRouter = express.Router();


expenseRouter.post("/add-expense", protect, async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }
        const { icon, category, amount, date } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const newExpense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        res.status(201).json({ success: true, expense: newExpense, message: "Expense added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" , error: error.message});
    }
});

expenseRouter.get("/get-expense", protect, async (req, res) => {
    const userId = req.user._id
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json({ success: true, expenses, message: "Expenses fetched successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" , error: error.message});
    }
});

expenseRouter.delete("/delete-expense/:id", protect, async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id)
        res.json({ deletedExpense, deletedExpense, message: "Expense Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = expenseRouter
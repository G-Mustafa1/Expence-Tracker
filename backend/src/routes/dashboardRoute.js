const protect = require("../middleware/auth");
const Expense = require("../models/Expance");
const Income = require("../models/Income");
const express = require("express");
const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard-data", protect, async (req, res) => {
    try {
        const userId = req.user?._id;
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);


        // Current Month Income Transactions
        const incomeTransactions = await Income.find({
            userId: userId,
            createdAt: { $gte: startOfCurrentMonth }
        }).sort({ createdAt: -1 });

        // Current Month Expense Transactions
        const expenseTransactions = await Expense.find({
            userId: userId,
            createdAt: { $gte: startOfCurrentMonth }
        }).sort({ createdAt: -1 });


        // Total Income & Total Expense
        const totalIncome = incomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
        const totalExpense = expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                incomeTransactions,
                expenseTransactions
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



dashboardRouter.get("/chart-data", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - 5);
    startDate.setDate(1);

    const incomeData = await Income.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalIncome: { $sum: "$amount" }
        }
      }
    ]);

    const expenseData = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalExpense: { $sum: "$amount" }
        }
      }
    ]);

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);

      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const label = d.toLocaleString("default", { month: "short" });

      const income = incomeData.find(
        i => i._id.month === month && i._id.year === year
      )?.totalIncome || 0;

      const expense = expenseData.find(
        e => e._id.month === month && e._id.year === year
      )?.totalExpense || 0;

      months.push({
        month: label,
        income,
        expense
      });
    }

    res.json({
      success: true,
      data: months
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




module.exports = dashboardRouter
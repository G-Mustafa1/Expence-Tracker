const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    icon: { type: String },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: "expenses"
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
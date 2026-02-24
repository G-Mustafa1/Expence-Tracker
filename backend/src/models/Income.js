const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    icon: { type: String },
    source: {
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
    collection: "incomes"
})

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
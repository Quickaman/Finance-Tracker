const express = require("express");
const router = express.Router(); 
const Expense = require("../models/Expense");

// ADD EXPENSE
router.post("/", async (req, res) => {
  try {
    const newExpense = new Expense(req.body); 
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense", error });
  }
});

// GET ALL EXPENSES
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
});

// UPDATE EXPENSE
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Failed to update expense", error });
  }
});

// DELETE EXPENSE
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense", error });
  }
});

module.exports = router;

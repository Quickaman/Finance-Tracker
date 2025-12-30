import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { label, value, date } = req.body;

    if (!label || !value || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      label,
      value,
      date,
      user: req.user,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    label: String,
    value: Number,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

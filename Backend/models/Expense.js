import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: { type: String, required: true },
    value: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

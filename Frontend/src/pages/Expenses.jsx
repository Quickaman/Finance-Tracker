import { useEffect, useState } from "react";
import { userRequest } from "../services/requestMethods";
import { formatCurrency } from "../utils/formatCurrency";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchExpenses = async () => {
    const res = await userRequest.get("/expenses");
    setExpenses(res.data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!label || !value || !date) return;

    if (editId) {
      await userRequest.put(`/expenses/${editId}`, {
        label,
        value,
        date,
      });
    } else {
      await userRequest.post("/expenses", {
        label,
        value,
        date,
      });
    }

    resetForm();
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await userRequest.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const startEdit = (expense) => {
    setEditId(expense._id);
    setLabel(expense.label);
    setValue(expense.value);
    setDate(expense.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditId(null);
    setLabel("");
    setValue("");
    setDate("");
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Expenses</h1>

      {/* FORM */}
      <form
        onSubmit={submitHandler}
        className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="flex-1">
          <label className="text-sm text-zinc-500">Category</label>
          <input
            type="text"
            placeholder="e.g. Food, Travel"
            className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="w-full md:w-40">
          <label className="text-sm text-zinc-500">Amount</label>
          <input
            type="number"
            placeholder="0"
            className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="w-full md:w-44">
          <label className="text-sm text-zinc-500">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={`px-6 py-2 rounded-xl text-white font-medium transition ${
              editId
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 rounded-xl bg-zinc-400 hover:bg-zinc-500 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {expenses.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm">Start adding to track your spending</p>
          </div>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-center p-5 hover:bg-zinc-50 transition"
            >
              <div>
                <p className="font-semibold text-lg">{exp.label}</p>
                <p className="text-sm text-zinc-400">{exp.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-rose-500">
                  {formatCurrency(exp.value)}
                </p>

                <button
                  onClick={() => startEdit(exp)}
                  className="px-4 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="px-4 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

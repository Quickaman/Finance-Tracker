import { useEffect, useState } from "react";
import { userRequest } from "../services/requestMethods";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);

  /* Fetch expenses */
  const fetchExpenses = async () => {
    const res = await userRequest.get("/expenses");
    setExpenses(res.data);
  };

  /* Add or Update */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!label || !value || !date) return;

    if (editId) {
      // UPDATE
      await userRequest.put(`/expenses/${editId}`, {
        label,
        value,
        date,
      });
    } else {
      // ADD
      await userRequest.post("/expenses", {
        label,
        value,
        date,
      });
    }

    resetForm();
    fetchExpenses();
  };

  /* Delete */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await userRequest.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  /* Start edit */
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
    <div>
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      {/* FORM */}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-xl shadow flex gap-4 items-center mb-8"
      >
        <input
          type="text"
          placeholder="Label"
          className="border rounded-lg px-4 py-2 w-1/3"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border rounded-lg px-4 py-2 w-1/4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <input
          type="date"
          className="border rounded-lg px-4 py-2 w-1/4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          type="submit"
          className={`px-6 py-2 rounded-lg text-white ${
            editId ? "bg-green-600" : "bg-indigo-600"
          }`}
        >
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg bg-gray-400 text-white"
          >
            Cancel
          </button>
        )}
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {expenses.map((exp) => (
          <div
            key={exp._id}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{exp.label}</p>
              <p className="text-gray-500">{exp.date}</p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-red-500 font-bold text-lg">₹{exp.value}</p>

              <button
                onClick={() => startEdit(exp)}
                className="px-4 py-1 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => deleteExpense(exp._id)}
                className="px-4 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

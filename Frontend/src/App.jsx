import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { publicRequest } from "./requestMethods";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [updatedId, setUpdatedId] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f97316", "#3b82f6"];

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await publicRequest.get("/api/v1/expenses");
      setExpenses(res.data);
      setFilteredExpenses(res.data);
      const total = res.data.reduce((acc, expense) => acc + expense.value, 0);
      setTotalAmount(total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense
  const handleAddExpense = async () => {
    try {
      await publicRequest.post("/api/v1/expenses", {
        label,
        date,
        value: parseFloat(amount),
      });
      setLabel("");
      setDate("");
      setAmount(0);
      setShowAddExpense(false);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/api/v1/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  // Open edit modal
  const handleShowEdit = (id) => {
    const exp = expenses.find(e => e._id === id);
    if (exp) {
      setUpdatedId(id);
      setUpdatedLabel(exp.label);
      setUpdatedAmount(exp.value);
      setUpdatedDate(exp.date);
      setShowEdit(true);
    }
  };

  // Update expense
  const handleUpdateExpense = async () => {
    try {
      await publicRequest.put(`/api/v1/expenses/${updatedId}`, {
        label: updatedLabel,
        date: updatedDate,
        value: parseFloat(updatedAmount),
      });
      setShowEdit(false);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  // Search filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = expenses.filter((expense) =>
      expense.label.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 p-10 bg-gray-50 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Dashboard</h1>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-gray-500">Total Balance</h4>
            <p className="text-2xl font-bold text-indigo-600">₹{totalAmount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-gray-500">Total Income</h4>
            <p className="text-2xl font-bold text-green-500">₹50000</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-gray-500">Total Expenses</h4>
            <p className="text-2xl font-bold text-red-500">₹{totalAmount}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700">Expense Overview</h2>
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10 flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={expenses.map(e => ({ name: e.label, value: e.value }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
            >
              {expenses.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="grid gap-4">
          {filteredExpenses.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span className="font-bold text-red-500">₹{item.value}</span>
              <div className="flex gap-4">
                <FaEdit
                  className="text-indigo-600 cursor-pointer"
                  onClick={() => handleShowEdit(item._id)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(item._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
              <input
                type="text"
                placeholder="Expense Name"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
              <input
                type="text"
                value={updatedLabel}
                onChange={(e) => setUpdatedLabel(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={updatedDate}
                onChange={(e) => setUpdatedDate(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateExpense}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

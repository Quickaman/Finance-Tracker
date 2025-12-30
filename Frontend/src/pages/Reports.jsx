import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../services/requestMethods";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f97316", "#ef4444", "#3b82f6"];

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await userRequest.get("/expenses");
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  /* Filter by month */
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(month));
  }, [expenses, month]);

  /* Total */
  const total = useMemo(
    () =>
      monthlyExpenses.reduce((sum, e) => sum + Number(e.value), 0),
    [monthlyExpenses]
  );

  /* Category Pie */
  const categoryData = useMemo(() => {
    const map = {};
    monthlyExpenses.forEach((e) => {
      map[e.label] = (map[e.label] || 0) + Number(e.value);
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [monthlyExpenses]);

  /* Daily Bar */
  const dailyData = useMemo(() => {
    const map = {};
    monthlyExpenses.forEach((e) => {
      map[e.date] = (map[e.date] || 0) + Number(e.value);
    });
    return Object.entries(map).map(([date, value]) => ({
      date,
      value,
    }));
  }, [monthlyExpenses]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      {/* FILTER */}
      <div className="flex items-center gap-4 mb-8">
        <label className="font-medium">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <p className="text-gray-500">Total Expenses</p>
        <p className="text-3xl font-bold text-red-500">₹{total}</p>
        <p className="text-sm text-gray-500 mt-1">
          {monthlyExpenses.length} transactions
        </p>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* CATEGORY PIE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Category Breakdown</h2>

          {categoryData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* DAILY BAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Daily Expenses</h2>

          {dailyData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TOP CATEGORIES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Top Spending Categories</h2>

        {categoryData
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
          .map((c) => (
            <div
              key={c.name}
              className="flex justify-between border-b py-2"
            >
              <span>{c.name}</span>
              <span className="font-bold text-red-500">₹{c.value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

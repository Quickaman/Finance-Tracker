import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../services/requestMethods";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/formatCurrency";


const COLORS = ["#6366f1", "#10b981", "#f97316", "#ef4444", "#3b82f6"];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await userRequest.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* TOTAL */
  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.value), 0),
    [expenses]
  );

  /* PIE DATA (group by label) */
  const pieData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.label] = (map[e.label] || 0) + Number(e.value);
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const [, forceRender] = useState(0);

useEffect(() => {
  const onStorage = () => forceRender((n) => n + 1);
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);


  /* LINE DATA (group by date) */
  const lineData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.date] = (map[e.date] || 0) + Number(e.value);
    });
    return Object.entries(map)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [expenses]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">
  {formatCurrency(totalExpense)}
</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Transactions</p>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Average / Expense</p>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(
  expenses.length ? Math.round(totalExpense / expenses.length) : 0
)}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* PIE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Expenses by Category
          </h2>

          {pieData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* LINE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Daily Expense Trend
          </h2>

          {lineData.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

        {expenses.slice(0, 5).map((e) => (
          <div
            key={e._id}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">{e.label}</p>
              <p className="text-sm text-gray-500">{e.date}</p>
            </div>
            <p className="font-bold text-red-500">
  {formatCurrency(e.value)}
</p>
          </div>
        ))}
      </div>
    </div>
  );
}

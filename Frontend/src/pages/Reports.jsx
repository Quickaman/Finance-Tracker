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
import { formatCurrency } from "../utils/formatCurrency";

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
    () => monthlyExpenses.reduce((sum, e) => sum + Number(e.value), 0),
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
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>

        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-500">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Total Spend</p>
          <p className="text-3xl font-bold text-rose-500 mt-1">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Transactions</p>
          <p className="text-3xl font-bold mt-1">
            {monthlyExpenses.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Average / Day</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">
            {formatCurrency(
              monthlyExpenses.length
                ? Math.round(total / monthlyExpenses.length)
                : 0
            )}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CATEGORY PIE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">
            Category Breakdown
          </h2>

          {categoryData.length === 0 ? (
            <p className="text-zinc-400 text-center py-20">
              No data for this month
            </p>
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
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* DAILY BAR */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">
            Daily Spending Trend
          </h2>

          {dailyData.length === 0 ? (
            <p className="text-zinc-400 text-center py-20">
              No data for this month
            </p>
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
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Top Spending Categories
        </h2>

        {categoryData.length === 0 ? (
          <p className="text-zinc-400">No data available</p>
        ) : (
          categoryData
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((c) => (
              <div
                key={c.name}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span className="font-medium">{c.name}</span>
                <span className="font-semibold text-rose-500">
                  {formatCurrency(c.value)}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

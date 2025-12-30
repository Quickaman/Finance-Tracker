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

  useEffect(() => {
    userRequest
      .get("/expenses")
      .then((res) => setExpenses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.value), 0),
    [expenses]
  );

  const pieData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.label] = (map[e.label] || 0) + Number(e.value);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

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
    return (
      <div className="text-zinc-400 text-lg">Loading dashboard...</div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpense)}
          color="text-rose-500"
        />
        <StatCard
          label="Transactions"
          value={expenses.length}
          color="text-indigo-600"
        />
        <StatCard
          label="Avg / Expense"
          value={formatCurrency(
            expenses.length
              ? Math.round(totalExpense / expenses.length)
              : 0
          )}
          color="text-emerald-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Expenses by Category">
          {pieData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, i) => (
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
        </ChartCard>

        <ChartCard title="Daily Expense Trend">
          {lineData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer height={280}>
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
        </ChartCard>
      </div>

      {/* RECENT EXPENSES */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Recent Expenses
        </h2>

        {expenses.slice(0, 5).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {expenses.slice(0, 5).map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-center p-4 rounded-xl hover:bg-zinc-50 transition"
              >
                <div>
                  <p className="font-medium">{e.label}</p>
                  <p className="text-sm text-zinc-400">
                    {e.date}
                  </p>
                </div>
                <p className="font-semibold text-rose-500">
                  {formatCurrency(e.value)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Reusable UI Components ---------- */

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-zinc-400">
      <p className="text-lg font-medium">No data yet</p>
      <p className="text-sm">
        Add expenses to see insights here
      </p>
    </div>
  );
}

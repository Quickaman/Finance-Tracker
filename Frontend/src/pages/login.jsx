import { useEffect, useState } from "react";
import { userRequest } from "../services/requestMethods";

export default function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "₹"
  );
  const [dateFormat, setDateFormat] = useState(
    localStorage.getItem("dateFormat") || "YYYY-MM-DD"
  );

  useEffect(() => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("dateFormat", dateFormat);
  }, [currency, dateFormat]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-zinc-500 mt-1">
          Manage preferences, security, and account options
        </p>
      </div>

      {/* PREFERENCES */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currency */}
          <div>
            <label className="block text-sm text-zinc-500 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm text-zinc-500 mb-2">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACCOUNT SECURITY */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-1">Account Security</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Update your password and manage sessions
        </p>

        {/* CHANGE PASSWORD */}
        <div className="max-w-md space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await userRequest.put("/auth/update-password", {
                  oldPassword,
                  newPassword,
                });

                alert("Password updated successfully");
                setOldPassword("");
                setNewPassword("");
              } catch (err) {
                alert(
                  err.response?.data?.message ||
                    "Failed to update password"
                );
              } finally {
                setLoading(false);
              }
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* LOGOUT */}
        <div className="border-t mt-8 pt-6">
          <button
            onClick={handleLogout}
            className="bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-rose-600 mb-1">
          Danger Zone
        </h2>
        <p className="text-sm text-rose-500">
          Future options: delete all expenses, close account, reset data.
        </p>
      </div>
    </div>
  );
}

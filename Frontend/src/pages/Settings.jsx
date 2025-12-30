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
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* PREFERENCES */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currency */}
          <div>
            <label className="block text-gray-600 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-gray-600 mb-1">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACCOUNT */}
<div className="bg-white p-6 rounded-xl shadow mb-8">
  <h2 className="text-xl font-semibold mb-2">Account</h2>

  <p className="text-gray-600 text-sm mb-6">
    Manage your account security and session.
  </p>

  {/* CHANGE PASSWORD */}
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-4">Change Password</h3>

    <div className="space-y-3 max-w-md">
      <input
        type="password"
        placeholder="Old Password"
        className="border p-2 rounded w-full"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 rounded w-full"
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
            alert(err.response?.data?.message || "Failed to update password");
          } finally {
            setLoading(false);
          }
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  </div>

  {/* LOGOUT */}
  <div className="border-t pt-4">
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</div>



      {/* DANGER ZONE */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Future Update
        </h2>
        <p className="text-sm text-red-500">
          Future options: delete all expenses, close account, reset data.
        </p>
      </div>
    </div>
  );
}

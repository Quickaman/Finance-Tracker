import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-indigo-100 hover:bg-indigo-600/70"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-indigo-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold text-white border-b border-indigo-600">
        Finance Tracker
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/" className={linkClasses}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/expenses" className={linkClasses}>
          <FaMoneyBillWave />
          Expenses
        </NavLink>

        <NavLink to="/reports" className={linkClasses}>
          <FaChartBar />
          Reports
        </NavLink>

        <NavLink to="/settings" className={linkClasses}>
          <FaCog />
          Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-red-500 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

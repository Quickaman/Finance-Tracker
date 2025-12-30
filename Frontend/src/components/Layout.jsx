import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

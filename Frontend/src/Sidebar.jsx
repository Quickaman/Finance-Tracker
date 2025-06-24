export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-600 mb-12">Finance Tracker</h2>
      <nav className="flex flex-col gap-6 text-gray-700">
        <a href="#" className="hover:text-indigo-600 font-medium">Dashboard</a>
        <a href="#" className="hover:text-indigo-600 font-medium">Expenses</a>
        <a href="#" className="hover:text-indigo-600 font-medium">Reports</a>
        <button className="mt-auto text-red-500 hover:text-red-600 font-semibold">Logout</button>
      </nav>
    </aside>
  );
}

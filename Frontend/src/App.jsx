import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethods";

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [updatedId, setUpdatedID] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  const handleAddExpense = () => {
    setShowAddExpense(!showAddExpense);
  };

  const handleShowReport = () => {
    setShowReport(!showReport);
  };

  const handleShowEdit = (id) => {
    setShowEdit(true);
    setUpdatedID(id);
  };

  const handleUpdateExpense = async () => {
    if (updatedId) {
      try {
        await publicRequest.put(`/api/v1/expenses/${updatedId}`, {
          value: parseFloat(updatedAmount),
          label: updatedLabel,
          date: updatedDate,
        });
        fetchExpenses();
        setShowEdit(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpense = async () => {
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

  const fetchExpenses = async () => {
    try {
      const res = await publicRequest.get("/api/v1/expenses");
      setExpenses(res.data);
      const filtered = res.data.filter((expense) =>
        expense.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExpenses(filtered);
      const total = res.data.reduce((acc, expense) => acc + expense.value, 0);
      setTotalAmount(total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/api/v1/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = expenses.filter((expense) =>
      expense.label.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mx-auto">
        <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

        <div className="relative flex items-center justify-between mt-5 w-full">
          <div className="relative flex justify-between w-[300px]">
            <button
              className="bg-[#af8978] p-[10px] text-white cursor-pointer"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-blue-300 p-[10px] text-white cursor-pointer"
              onClick={handleShowReport}
            >
              Expense Report
            </button>
          </div>

          {showAddExpense && (
            <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-0 h-[500px] w-[500px] bg-white shadow-xl">
              <FaWindowClose
                className="self-end text-2xl text-red-500 cursor-pointer"
                onClick={handleAddExpense}
              />
              <label className="mt-[10px] font-semibold text-[18px]">
                Expense Name
              </label>
              <input
                type="text"
                placeholder="Snacks"
                className="outline-none border-2 border-[#555] p-[10px]"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <label className="mt-[10px] font-semibold text-[18px]">
                Expense Date
              </label>
              <input
                type="date"
                className="outline-none border-2 border-[#555] p-[10px]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label className="mt-[10px] font-semibold text-[18px]">
                Expense Amount
              </label>
              <input
                type="number"
                className="outline-none border-2 border-[#555] p-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                className="bg-[#af8978] text-white p-[10px] my-[10px]"
                onClick={handleExpense}
              >
                Add Expense
              </button>
            </div>
          )}

          {showReport && (
            <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-[100px] h-[500px] w-[500px] bg-white shadow-xl">
              <FaWindowClose
                className="self-end text-2xl text-red-500 cursor-pointer"
                onClick={handleShowReport}
              />
              <PieChart
                series={[
                  {
                    data: expenses,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 180,
                    cx: 150,
                    cy: 150,
                  },
                ]}
              />
              <div className="text-center mt-4 text-lg font-semibold">
                Total Expenses: ₹{totalAmount}
              </div>
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Search"
              className="p-[10px] w-[150px] border-2 border-[#444]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-col">
          {filteredExpenses.map((item, index) => (
            <div
              className="flex justify-between items-center w-[80vw] h-[100px] bg-[#f3edeb] my-[20px] py-[10px] px-[20px]"
              key={index}
            >
              <h2 className="text-[#555] text-[18px] font-medium">
                {item.label}
              </h2>
              <span className="text-[18px]">{item.date}</span>
              <span className="text-[18px] font-medium">₹ {item.value}</span>
              <div>
                <FaTrash
                  className="text-red-500 mb-[5px] cursor-pointer"
                  onClick={() => handleDelete(item._id)}
                />
                <FaEdit
                  className="text-[#555] mb-[5px] cursor-pointer"
                  onClick={() => handleShowEdit(item._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {showEdit && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[25%] right-0 h-[500px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="self-end text-2xl text-red-500 cursor-pointer"
              onClick={() => setShowEdit(false)}
            />
            <label className="mt-[10px] font-semibold text-[18px]">
              Expense Name
            </label>
            <input
              type="text"
              className="outline-none border-2 border-[#555] p-[10px]"
              value={updatedLabel}
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <label className="mt-[10px] font-semibold text-[18px]">
              Expense Date
            </label>
            <input
              type="date"
              className="outline-none border-2 border-[#555] p-[10px]"
              value={updatedDate}
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <label className="mt-[10px] font-semibold text-[18px]">
              Expense Amount
            </label>
            <input
              type="number"
              className="outline-none border-2 border-[#555] p-[10px]"
              value={updatedAmount}
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />

            <button
              className="bg-[#af8978] text-white p-[10px] my-[10px]"
              onClick={handleUpdateExpense}
            >
              Update Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

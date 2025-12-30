import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { sendMail } from "../helpers/SendMail.js";

const getLast7DaysDate = () => {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
};

export default async function sendWeeklyExpenseReport() {
  try {
    console.log("sendWeeklyExpenseReport STARTED");

    const users = await User.find({});
    console.log("Users found:", users.length);

    const fromDate = getLast7DaysDate();

    for (const user of users) {
      console.log("Processing user:", user.email);

      const expenses = await Expense.find({
        user: user._id,
        createdAt: { $gte: fromDate },
      });

      console.log("Expenses found:", expenses.length);

      if (expenses.length === 0) continue;

      const total = expenses.reduce(
        (sum, e) => sum + Number(e.value),
        0
      );

      const categoryMap = {};
      expenses.forEach((e) => {
        categoryMap[e.label] =
          (categoryMap[e.label] || 0) + Number(e.value);
      });

      const rows = Object.entries(categoryMap)
        .map(
          ([label, value]) =>
            `<tr>
              <td>${label}</td>
              <td>₹${value}</td>
            </tr>`
        )
        .join("");

      const html = `
        <h2>Weekly Expense Summary</h2>
        <p>Hello ${user.name || "User"},</p>
        <p><b>Total spent last 7 days:</b> ₹${total}</p>
        <table border="1" cellpadding="8">
          <tr><th>Category</th><th>Amount</th></tr>
          ${rows}
        </table>
      `;

      await sendMail(
        user.email,
        "Your Weekly Expense Report",
        html
      );

      console.log("Email sent to:", user.email);
    }
  } catch (err) {
    console.error("Weekly email job failed:", err);
  }
}

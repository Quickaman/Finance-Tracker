const expenseEmail = async () => {
  try {
    const expenses = await Expense.find({});
    const totalExpense = expenses.reduce(
      (acc, expense) => acc + expense.value,
      0
    );

    const today = new Date().toLocaleDateString("en-IN");

    const messageoption = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Daily Expense Summary",
      text: `As of ${today}, your total expense is ₹${totalExpense.toLocaleString("en-IN")}.`,
    };

    await sendMail(messageoption);
  } catch (error) {
    console.error("Error in expenseEmail:", error.message);
  }
};

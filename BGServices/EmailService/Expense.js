const sendMail = require("../sendMail");

const expenseEmail = async () => {
  try {
    const recipientEmail = "xyz@gmail.com";

    await sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: "Your Daily Expense Summary",
      text: "Hello! Here is your expense summary for today.",
    });

    console.log("Expense email sent successfully.");
  } catch (error) {
    console.error("Failed to send expense email:", error.message);
  }
};

module.exports = { expenseEmail };

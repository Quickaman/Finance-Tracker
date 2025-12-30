import "dotenv/config";

import mongoose from "mongoose";
import cron from "node-cron";
import sendWeeklyExpenseReport from "./jobs/weeklyExpenseReport.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("BGServices connected to MongoDB"))
  .catch(console.error);

cron.schedule("0 9 * * 1", async () => {
  await sendWeeklyExpenseReport();
});

import cron from "node-cron";
import { ReminderController } from "../controllers/reminder.controller";
import logger from "../utils/logger";

cron.schedule("0 0 * * *", async () => {
    try {
        logger.info("Running daily reminder check...");
        await ReminderController.checkRemindersForToday();
    } catch (error) {
        logger.error("Error checking reminders:", error);
    }
});

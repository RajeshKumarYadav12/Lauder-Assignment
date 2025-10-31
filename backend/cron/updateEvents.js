import cron from "node-cron";
import { scrapeAllEvents } from "../utils/scraper.js";

/**
 * Set up cron job to automatically update events
 * Default: Run every 6 hours
 * Cron format: minute hour day month weekday
 */
export const setupEventUpdateCron = () => {
  // Get interval from env or default to 6 hours
  const intervalHours = process.env.SCRAPER_INTERVAL_HOURS || 6;

  // Run every N hours (at minute 0)
  const cronExpression = `0 */${intervalHours} * * *`;

  console.log(`⏰ Setting up cron job to run every ${intervalHours} hours`);

  // Schedule the cron job
  cron.schedule(cronExpression, async () => {
    console.log(
      `\n🔄 [${new Date().toISOString()}] Running scheduled event update...`
    );

    try {
      const result = await scrapeAllEvents();

      if (result.success) {
        console.log(
          `✅ Scheduled update complete: ${result.saved} new, ${result.updated} updated`
        );
      } else {
        console.error("❌ Scheduled update failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Error in scheduled update:", error.message);
    }
  });

  console.log("✅ Cron job scheduled successfully");

  // Optional: Run immediately on startup
  runInitialScrape();
};

/**
 * Run initial scrape when server starts
 * This ensures we have data immediately
 */
const runInitialScrape = async () => {
  console.log("\n🚀 Running initial event scrape...");

  try {
    const result = await scrapeAllEvents();

    if (result.success) {
      console.log(
        `✅ Initial scrape complete: ${result.saved} new, ${result.updated} updated\n`
      );
    } else {
      console.error("❌ Initial scrape failed:", result.error, "\n");
    }
  } catch (error) {
    console.error("❌ Error in initial scrape:", error.message, "\n");
  }
};

export default setupEventUpdateCron;

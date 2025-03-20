const cron = require("node-cron");
const Grant = require("../models/Grant");
const { sendEmailByTemplate } = require("../services/emailService");
const moment = require("moment-business-days");

// Function to send reminders
const sendFinalReviewReminders = async () => {
  try {
    console.log("🔍 Checking for grants needing final review reminders...");

    // Calculate today's date
    const today = moment().startOf("day");

    // Find grants where sponsorDeadlineDate is 5 business days away
    const upcomingGrants = await Grant.find({
      sponsorDeadlineDate: {
        $gte: today.toDate(), // Ensure the deadline is in the future
        $lte: today.businessAdd(5)._d, // Exactly 5 business days from today
      },
    });

    for (const grant of upcomingGrants) {
      const { piLastName, piEmail, piDivision, projectTitle } = grant;

      // Prepare email data
      const emailData = { piLastName, piEmail, piDivision, projectTitle };

      // 🚀 Send email reminder
      await sendEmailByTemplate("FINAL_REVIEW_REMINDER", emailData, [piEmail]);

      console.log(`📧 Reminder email sent to ${piEmail} for grant: ${projectTitle}`);
    }
  } catch (error) {
    console.error("❌ Error sending final review reminders:", error);
  }
};

// Schedule the job to run every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("⏳ Running scheduled job: Final Review Reminder...");
  await sendFinalReviewReminders();
});

module.exports = sendFinalReviewReminders;

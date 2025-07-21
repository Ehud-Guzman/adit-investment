import dotenv from "dotenv";
dotenv.config();

import { sendVerificationEmail } from "./emailService.js";

(async () => {
  try {
    const testEmail = "nyamuehud@gmail.com"; // Replace with YOUR email
    const name = "Guzman Dev";
    const dummyLink = `${process.env.FRONTEND_URL}/verify-email/test-token`;

    await sendVerificationEmail(testEmail, name, dummyLink);
    console.log("✅ Test email sent!");
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
})();

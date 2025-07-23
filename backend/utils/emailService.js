import nodemailer from "nodemailer";

// ✅ Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // or 587 if you're not using SSL
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✉️ Send verification email
export const sendVerificationEmail = async (email, name, link) => {
  // 🛡️ Sanity check env vars
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
    console.error("❌ Missing EMAIL env variables");
    throw new Error("Email environment variables not configured.");
  }

  // 🖌️ Branded HTML template
  const html = `
    <div style="max-width: 600px; margin: auto; padding: 24px; font-family: 'Segoe UI', sans-serif; color: #333; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="text-align: center;">
        <h1 style="color: #22c55e;">ADIT Investment</h1>
        <p style="font-size: 18px; margin-bottom: 24px;">Verify your email address</p>
      </div>

      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 24px; background-color: #22c55e; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;">
          Verify Email
        </a>
      </div>

      <p style="font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <div style="word-break: break-word; background-color: #f9f9f9; padding: 12px; border-radius: 4px; font-size: 13px; color: #555;">
        ${link}
      </div>

      <hr style="margin: 32px 0;" />

      <p style="font-size: 14px; color: #999;">
        This link will expire in 5 hours. If you didn’t create an account, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; margin-top: 32px;">Cheers,<br/><strong>The ADIT Investment Team</strong></p>

      <div style="margin-top: 48px; font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} ADIT Investment. All rights reserved.
      </div>
    </div>
  `;

  // 📨 Mail options
  const mailOptions = {
    from: `"ADIT Investment" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email – ADIT Investment",
    text: `Hi ${name},\nPlease verify your email: ${link}\n\nThis link expires in 5 hours.`,
    html,
  };

  // 🚀 Send mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📬 Email sent to ${email} — Message ID: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message || err);
    throw new Error("Email sending failed.");
  }
};

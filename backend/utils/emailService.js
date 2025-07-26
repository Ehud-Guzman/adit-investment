import nodemailer from "nodemailer";

// ✅ Setup secure Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 587 with secure: false if needed
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✉️ Send Verification Email
export const sendVerificationEmail = async (email, name = "there", link) => {
  // 🔐 Env check
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
    console.error("❌ Missing email environment variables");
    throw new Error("Email configuration is incomplete.");
  }

  if (!email || !link) {
    console.error("❌ Missing recipient email or verification link");
    throw new Error("Email or verification link is missing.");
  }

  // 🎨 HTML template
  const html = `
    <div style="max-width: 600px; margin: auto; padding: 24px; font-family: 'Segoe UI', sans-serif; color: #333; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="text-align: center;">
        <h1 style="color: #22c55e;">ADIT Investment</h1>
        <p style="font-size: 18px; margin-bottom: 24px;">Verify Your Email Address</p>
      </div>

      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for joining ADIT Investment! To complete your signup, please verify your email address:</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="padding: 14px 24px; background-color: #22c55e; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;">
          Verify Email
        </a>
      </div>

      <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
      <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; font-size: 13px; color: #555; word-break: break-all;">
        ${link}
      </div>

      <hr style="margin: 32px 0;" />

      <p style="font-size: 14px; color: #999;">
        This link will expire in 5 hours. If you didn’t create an account, you can ignore this email.
      </p>

      <p style="margin-top: 32px; font-size: 14px;">Cheers,<br/><strong>The ADIT Investment Team</strong></p>

      <div style="margin-top: 48px; font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} ADIT Investment. All rights reserved.
      </div>
    </div>
  `;

  // 📧 Email payload
  const mailOptions = {
    from: `"ADIT Investment" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email – ADIT Investment",
    text: `Hi ${name},\n\nThanks for signing up. Please verify your email using the following link:\n\n${link}\n\nThis link expires in 5 hours.`,
    html,
  };

  // 🚀 Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📬 Verification email sent to ${email} — Message ID: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Failed to send verification email:", err);
    throw new Error("Verification email failed to send.");
  }
};

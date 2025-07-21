import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, name, link) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
    console.error("❌ Missing EMAIL env variables");
    throw new Error("Email environment variables not configured.");
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Hello, ${name}</h2>
      <p>Please verify your email by clicking below:</p>
      <a href="${link}" style="padding:10px 15px; background:#22c55e; color:white; text-decoration:none; border-radius:5px;">
        Verify Email
      </a>
      <p>This link expires in 5 hours.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
    console.log("📩 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email send failed:", err.message || err);
    throw new Error("Email sending failed.");
  }
};

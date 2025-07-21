import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signRefreshToken } from "../../../utils/tokens.js";
import { cleanUser, handleError } from "../../../utils/auth.helpers.js";
import { sendVerificationEmail } from "../../../utils/emailService.js";
import { createEmailTokenModel } from "../../../models/emailTokenModel.js";

/**
 * @desc Handles user registration and sends a verification email
 * @route POST /api/auth/register
 * @access Public
 */
const registerHandler = async (req, res, users, sessions, db) => {
  try {
    const { name, email, password } = req.body;

    // 🛡️ Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check for existing user
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Create new user document
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      status: "active",
      createdAt: new Date(),
      isVerified: false,
      emailVerifiedAt: null,
    };

    const { insertedId: userId } = await users.insertOne(newUser);

    // 🎟️ Generate email verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // 💾 Save hashed token to email_tokens collection
    const emailTokens = createEmailTokenModel(db);
    await emailTokens.createToken(userId, hashedToken, expiresAt);

    // 🔗 Construct verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;
    console.log("🔗 Email Verification URL:", verificationUrl); // For dev logs

    // 📧 Send email
    try {
      await sendVerificationEmail(email, name, verificationUrl);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
      return res.status(500).json({
        message: "Account created, but verification email could not be sent. Please try again later.",
      });
    }

    // 🎯 Clean user object
    const user = cleanUser({
      _id: userId,
      name,
      email,
      role: "user",
      status: "active",
    });

    // 💾 Create a refresh token session (optional but useful for merging cart later)
    await sessions.insertOne({
      userId: user._id,
      refreshToken: signRefreshToken(user),
      createdAt: new Date(),
    });

    // 🎉 Send final response
    return res.status(201).json({
      message: "Registration successful. Please verify your email before logging in.",
    });

  } catch (err) {
    console.error("💥 Registration failed:", err);
    return handleError(res, err, "Registration failed");
  }
};

export default registerHandler;

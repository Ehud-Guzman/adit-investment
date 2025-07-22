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

    // 🚦 Required fields check
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔎 Check if email already exists
    const existingUser = await users.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // 🔁 bumped to 12 rounds

    // 📦 Prepare user data
    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "user",
      isAdmin: false,
      isSuperAdmin: false,
      status: "active",
      isVerified: false,
      emailVerifiedAt: null,
      createdAt: new Date(),
    };

    // 💾 Save user to DB
    const { insertedId: userId } = await users.insertOne(newUser);

    // 🔐 Generate and hash email verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    // 📬 Store token in DB
    const emailTokens = createEmailTokenModel(db);
    await emailTokens.createToken(userId, hashedToken, expiresAt);

    // 📨 Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;
    console.log("🔗 Verification URL:", verificationUrl);

    try {
      await sendVerificationEmail(email, name, verificationUrl);
    } catch (emailErr) {
      console.error("❌ Failed to send verification email:", emailErr.message);
      return res.status(500).json({
        message: "Account created, but failed to send verification email.",
      });
    }

    // 🧼 Optional: Store session for merging cart later
    const sessionToken = signRefreshToken({
      _id: userId,
      email: newUser.email,
      role: "user",
      isAdmin: false,
      isSuperAdmin: false,
    });

    await sessions.insertOne({
      userId,
      refreshToken: sessionToken,
      createdAt: new Date(),
    });

    // ✅ Final Response
    return res.status(201).json({
      message: "Registration successful. Please verify your email before logging in.",
    });

  } catch (err) {
    console.error("💥 Registration failed:", err);
    return handleError(res, err, "Registration failed");
  }
};

export default registerHandler;

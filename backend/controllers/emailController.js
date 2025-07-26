import { ObjectId } from "mongodb";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

export const createEmailController = (db) => {
  const users = db.collection("users");
  const emailTokens = db.collection("email_tokens");

  return {
    // ✅ Email verification handler
    verifyEmail: async (req, res) => {
      const rawToken = req.params.token;

      try {
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const tokenDoc = await emailTokens.findOne({ token: hashedToken });

        if (!tokenDoc) {
          return res.status(400).json({
            message: "❌ Invalid or expired token. Please request a new verification link.",
          });
        }

        if (tokenDoc.expiresAt < new Date()) {
          await emailTokens.deleteOne({ token: hashedToken });
          return res.status(400).json({ message: "⏰ Token expired. Request a new one." });
        }

        const userId = new ObjectId(tokenDoc.userId);
        const user = await users.findOne({ _id: userId });

        if (!user) {
          await emailTokens.deleteOne({ token: hashedToken });
          return res.status(404).json({ message: "❌ User not found." });
        }

        if (user.isVerified) {
          await emailTokens.deleteOne({ token: hashedToken }); // cleanup anyway
          return res.status(200).json({
            alreadyVerified: true,
            message: "✅ Email already verified. You can log in.",
          });
        }

        await users.updateOne(
          { _id: userId },
          {
            $set: {
              isVerified: true,
              emailVerifiedAt: new Date(),
            },
          }
        );

        await emailTokens.deleteOne({ token: hashedToken });

        return res.status(200).json({
          message: "✅ Email verified successfully!",
          verified: true,
        });
      } catch (err) {
        console.error("❌ Email verification error:", err);
        return res.status(500).json({
          message: "🚨 Internal server error during verification.",
        });
      }
    },

    // 🔁 Resend verification email handler
    resendVerificationEmail: async (req, res) => {
      const { email } = req.body;

      try {
        if (!email || typeof email !== "string") {
          return res.status(400).json({ message: "⚠️ A valid email is required." });
        }

        const user = await users.findOne({ email });

        if (!user) {
          return res.status(404).json({ message: "❌ User not found." });
        }

        if (user.isVerified) {
          return res.status(400).json({ message: "✅ Email is already verified." });
        }

        // Clear old tokens
        await emailTokens.deleteMany({ userId: user._id });

        // Generate and hash new token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours

        await emailTokens.insertOne({
          userId: user._id,
          token: hashedToken,
          expiresAt,
        });

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

        await sendVerificationEmail(user.email, user.name || "there", verificationUrl);

        return res.status(200).json({ message: "📨 Verification email sent." });
      } catch (err) {
        console.error("❌ Resend email error:", err);
        return res.status(500).json({
          message: "🚨 Failed to resend verification email.",
        });
      }
    },
  };
};

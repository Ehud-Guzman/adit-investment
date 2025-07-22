import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
} from "../../../utils/tokens.js";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../config/cookieOptions.js";

import { handleError } from "../../../utils/auth.helpers.js";

const loginHandler = async (req, res, users, sessions) => {
  try {
    const { email, password } = req.body;

    // 🔍 Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 🧠 Check if user exists
    const user = await users.findOne({ email });

    const passwordValid = user && await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 Block unverified or inactive accounts
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
      });
    }

    if (user.status === "locked" || user.status === "deleted") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    // 🧹 Cleaned + structured user for token + client
    const normalizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin === true,
      isSuperAdmin: user.isSuperAdmin === true,
      status: user.status,
      isVerified: user.isVerified,
    };

    // 🔐 Sign tokens
    const accessToken = signAccessToken(normalizedUser);
    const refreshToken = signRefreshToken(normalizedUser);

    // 💾 Save session to DB
    await sessions.insertOne({
      userId: normalizedUser._id,
      refreshToken,
      createdAt: new Date(),
    });

    // 🍪 Set tokens as HttpOnly cookies and send response
    res
      .cookie("token", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        token: accessToken,
        user: normalizedUser,
      });

  } catch (err) {
    handleError(res, err, "Login failed");
  }
};

export default loginHandler;

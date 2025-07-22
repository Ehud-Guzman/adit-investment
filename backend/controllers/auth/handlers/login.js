import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
} from "../../../utils/tokens.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../../config/cookieOptions.js";
import {
  cleanUser,
  handleError,
} from "../../../utils/auth.helpers.js";
import { toastGuard } from "@/utils/toastControl";


const loginHandler = async (req, res, users, sessions) => {
  try {
    const { email, password } = req.body;

    // 🛑 Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 🔍 Find user
    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🛡️ Check account status
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
      });
    }

    if (user.status === "locked" || user.status === "deleted") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    // ✅ Clean + normalize user
    const safeUser = cleanUser(user);
    const normalizedUser = {
      ...safeUser,
      role: user.isAdmin ? "admin" : "user", // 👈 key fix
    };

    // 🔐 Generate tokens
    const accessToken = signAccessToken(normalizedUser);
    const refreshToken = signRefreshToken(normalizedUser);

    // 💾 Store session in DB
    await sessions.insertOne({
      userId: normalizedUser._id,
      refreshToken,
      createdAt: new Date(),
    });

    // 🍪 Send cookies + response
    return res
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

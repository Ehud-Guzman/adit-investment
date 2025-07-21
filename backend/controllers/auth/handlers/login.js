import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../../../utils/tokens.js";
import { accessCookieOptions, refreshCookieOptions } from "../../../config/cookieOptions.js";
import { cleanUser, handleError } from "../../../utils/auth.helpers.js";

const loginHandler = async (req, res, users, sessions) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔒 Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
      });
    }

    if (user.status === "locked" || user.status === "deleted") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    const safeUser = cleanUser(user);
    const accessToken = signAccessToken(safeUser);
    const refreshToken = signRefreshToken(safeUser);

    await sessions.insertOne({
      userId: safeUser._id,
      refreshToken,
      createdAt: new Date(),
    });

    return res
      .cookie("token", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({ token: accessToken, user: safeUser });
  } catch (err) {
    handleError(res, err, "Login failed");
  }
};

export default loginHandler;

import { handleError } from "../../../utils/auth.helpers.js";
import { accessCookieOptions, refreshCookieOptions } from "../../../config/cookieOptions.js";

const logoutHandler = async (req, res, sessions) => {
  try {
    const token = req.cookies.refreshToken;
    console.log("🪙 Refresh Token on logout:", token);

    if (token) {
      const result = await sessions.deleteOne({ refreshToken: token });
      console.log("🗑️ Session delete result:", result);
    }

    res
      .clearCookie("token", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    handleError(res, err, "Logout failed");
  }
};

export default logoutHandler;

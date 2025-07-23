import { handleError } from "../../../utils/auth.helpers.js";
import { accessCookieOptions, refreshCookieOptions } from "../../../config/cookieOptions.js";

const logoutHandler = async (req, res, sessions) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await sessions.deleteOne({ refreshToken: token });
    }

    return res
      .clearCookie("token", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    handleError(res, err, "Logout failed");
  }
};

export default logoutHandler;

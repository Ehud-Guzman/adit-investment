import { ObjectId } from "mongodb";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../../../utils/tokens.js";
import { accessCookieOptions, refreshCookieOptions } from "../../../config/cookieOptions.js";
import { cleanUser } from "../../../utils/auth.helpers.js";

const refreshTokenHandler = async (req, res, users, sessions) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token", error: err.message });
    }

    if (!ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status === "locked" || user.status === "deleted") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    const session = await sessions.findOne({ refreshToken: token });
    if (!session) {
      await sessions.deleteMany({ userId: new ObjectId(decoded.userId) });
      return res.status(403).json({ message: "Token reuse detected. Sessions revoked." });
    }

    const safeUser = cleanUser(user);
    const newAccessToken = signAccessToken(safeUser);
    const newRefreshToken = signRefreshToken(safeUser);

    await sessions.updateOne(
      { refreshToken: token },
      { $set: { refreshToken: newRefreshToken, updatedAt: new Date() } }
    );

    return res
      .cookie("token", newAccessToken, accessCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
      .json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("Token refresh failed:", err);
    return res.status(500).json({ message: "Token refresh failed", error: err.message });
  }
};

export default refreshTokenHandler;

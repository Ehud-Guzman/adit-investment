// middleware/auth/lib/baseVerify.js
import { decodeToken } from "./decodeToken.js";

/**
 * 🛡️ baseVerify
 * Attaches decoded JWT to `req.user` and runs optional validation rules.
 *
 * @param {object} options
 * @param {string} options.secret - JWT secret used to verify the token.
 * @param {string} [options.cookie="token"] - Optional cookie name fallback.
 * @param {Function[]} [options.checks=[]] - Array of validation functions: (decoded, req) => {status, message} | null
 * @returns Express middleware
 */
export const baseVerify =
  ({ secret, cookie = "token", checks = [] }) =>
  (req, res, next) => {
    try {
      // 🔍 Decode token from cookie, header, or query
      const decoded = decodeToken(req, secret, cookie);

      // 🧠 Common logic: blocked or deleted users
      if (decoded.status === "deleted") {
        return res.status(403).json({ message: "Account has been deleted" });
      }

      if (decoded.status === "locked") {
        return res.status(403).json({ message: "Account is locked" });
      }

      // 🚨 Run custom rule checks (if any)
      for (const check of checks) {
        const error = check(decoded, req);
        if (error) {
          console.warn(`[AUTH BLOCKED] ❌ ${error.message} — ${req.method} ${req.originalUrl}`);
          return res
            .status(error.status || 403)
            .json({ message: error.message });
        }
      }

      // ✅ Attach useful auth metadata
      req.user = {
        userId: decoded.userId,
        isAdmin: !!decoded.isAdmin,
        role: decoded.role || "user",
        status: decoded.status || "active",
        source: decoded._tokenSource || "unknown",
      };
      req.userId = decoded.userId;
      req.isAdmin = !!decoded.isAdmin;

      next();
    } catch (err) {
      const isExpired = err.name === "TokenExpiredError";

      console.error(
        `[AUTH ERROR] 💣 ${err.message} @ ${req.method} ${req.originalUrl}`
      );

      return res.status(401).json({
        message: isExpired
          ? "Session expired. Please log in again."
          : "Unauthorized access",
        error: err.message,
      });
    }
  };

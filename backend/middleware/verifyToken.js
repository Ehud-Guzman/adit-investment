// middleware/verifyToken.js
import jwt from "jsonwebtoken";

/**
 * ✅ Generic token verification middleware
 * Supports accessToken from cookies or Authorization header.
 * Adds decoded user info to req.user.
 */
export const verifyToken = (req, res, next) => {
  let token;

  // 1. Check cookies (preferred)
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2. Fallback to Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. No token found
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach roles + flags for downstream usage
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      isAdmin: ["admin", "superadmin"].includes(decoded.role),
      isSuperAdmin: decoded.role === "superadmin",
    };

    console.log("🔐 Authenticated user:", req.user); // for dev/debugging
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    return res.status(401).json({
      message: isExpired ? "Token expired" : "Invalid token",
      error: err.message,
    });
  }
};

/**
 * 🔒 Middleware for admin-only routes
 * Requires token to be valid and role to be 'admin' or 'superadmin'
 */
export const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access only." });
    }
    next();
  });
};

/**
 * 🔒 Middleware for superadmin-only routes
 */
export const verifySuperAdminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({ message: "Super admin access only." });
    }
    next();
  });
};

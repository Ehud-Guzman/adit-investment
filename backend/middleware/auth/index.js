// middleware/auth/index.js
import { baseVerify } from "./lib/baseVerify.js";
import { rules } from "./lib/rules.js";
import { decodeToken } from "./lib/decodeToken.js";

// 🔐 Token Verifiers
export const verifyToken = baseVerify({
  secret: process.env.JWT_SECRET,
});

export const verifyAdmin = baseVerify({
  secret: process.env.JWT_SECRET,
  checks: [rules.admin],
});

export const verifyUser = baseVerify({
  secret: process.env.JWT_SECRET,
  checks: [rules.userExists],
});

export const verifyUserOrAdmin = baseVerify({
  secret: process.env.JWT_SECRET,
  checks: [rules.userMatch],
});

export const verifyAdminOrUser = baseVerify({
  secret: process.env.JWT_SECRET,
  checks: [rules.userExists, rules.userMatch],
});

export const verifySelfOnly = baseVerify({
  secret: process.env.JWT_SECRET,
  checks: [rules.selfOnly],
});

export const verifyRefreshToken = baseVerify({
  secret: process.env.JWT_REFRESH_SECRET,
  cookie: "refreshToken",
});

// ✅ Main protect middleware (adds req.user + req.isAdmin)
export const protect = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    req.isAdmin = !!req.user?.isAdmin; // ✅ Set from decoded token
    next();
  });
};

// ✅ Optional token decoding (no error thrown if not present)
export const verifyTokenOptional = (req, _res, next) => {
  try {
    const decoded = decodeToken(req, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = !!decoded.isAdmin;
  } catch {
    req.userId = null;
    req.isAdmin = false;
  }
  next();
};

// ✅ Use decoded token directly (no need for req.isAdmin anymore)
export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next(); // 🔥 cleaner, more reliable
  return res.status(403).json({ message: "Admin access only" });
};

// ✅ Wrapper for async handlers
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const verifySuperAdmin = (req, res, next) => {
  if (req.user?.role === "superadmin") return next();
  return res.status(403).json({ message: "Forbidden: SuperAdmin only." });
};

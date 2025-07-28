// middleware/auth.js
import jwt from "jsonwebtoken";

export function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role || "user",
      isAdmin: decoded.isAdmin ?? (decoded.role === "admin" || decoded.role === "superadmin"),
    };

    console.log("✅ Authenticated:", req.user);

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Add this for role-based protection
export function verifyRole(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "🚫 Access denied: Admins only." });
  }
  next();
}

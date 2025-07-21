// middleware/auth.js
import jwt from "jsonwebtoken";

export function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // 🔐 1. Check token presence
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔎 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 3. Attach full user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role || "user",
      isAdmin: decoded.isAdmin ?? (decoded.role === "admin" || decoded.role === "superadmin"),
    };

    // 🧪 Optional: log for debugging
    console.log("✅ Authenticated:", req.user);

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

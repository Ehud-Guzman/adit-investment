// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;

  // ✅ First try cookies (most secure)
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // ✅ Then fallback to Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ❌ No token anywhere
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 💡 Add roles + flags to req.user for easy role-based access later
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      isAdmin: ["admin", "superadmin"].includes(decoded.role),
      isSuperAdmin: decoded.role === "superadmin",
    };

    console.log("🔑 Verified token:", req.user); // useful during debugging
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ message: msg, error: err.message });
  }
};

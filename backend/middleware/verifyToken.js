// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 Standardize the payload into req.user
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

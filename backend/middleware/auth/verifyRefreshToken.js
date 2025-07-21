import jwt from "jsonwebtoken";

export const verifyRefreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

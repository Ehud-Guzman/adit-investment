// middleware/verifyRole.js

export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || req.user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return res.status(403).json({
          message: `❌ Access denied. Only '${requiredRole}' role can access this resource.`,
        });
      }
      next();
    } catch (err) {
      console.error("🔐 Role verification error:", err.message);
      res.status(500).json({ message: "Role check failed." });
    }
  };
};

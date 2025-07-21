// middleware/auth/verifySuperAdmin.js
export const verifySuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access required" });
  }
  next();
};

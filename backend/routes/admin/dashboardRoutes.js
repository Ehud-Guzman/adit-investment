import express from "express";
import { getDashboardOverview } from "../../controllers/admin/dashboard.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyRole } from "../../middleware/verifyRole.js"; // 🆕 Role-based access control

export default function createAdminDashboardRouter() {
  const router = express.Router();

  // 🛡️ SUPER ADMIN ONLY: Secure Dashboard Metrics
  router.get(
    "/overview",
    verifyToken,
    verifyRole("superadmin"), // 🔐 Only superadmins allowed
    getDashboardOverview
  );

  return router;
}

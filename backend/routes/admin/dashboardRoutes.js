import express from "express";
import { getDashboardOverview } from "../../controllers/admin/dashboard.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyAdminToken } from "../../middleware/verifyToken.js";

export default function createAdminDashboardRouter() {
  const router = express.Router();

  // 🛡️ ADMIN: Secure Dashboard Metrics
  router.get(
    "/overview",
    verifyAdminToken,
    getDashboardOverview
  );

  return router;
}

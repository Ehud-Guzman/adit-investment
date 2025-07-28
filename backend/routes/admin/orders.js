// routes/admin/orders.js
import express from "express";
import { getAllOrders } from "../../controllers/admin/adminOrderController.js";
import { verifyAuth, verifyRole } from "../../middleware/auth.js";

const createAdminOrderRoutes = (collections) => {
  const router = express.Router();
  const { orders, users } = collections;

  // 🔐 Auth middleware for all admin routes
  router.use(verifyAuth, verifyRole);

  // 🧾 GET /api/admin/orders
  router.get("/", getAllOrders(orders, users));

  return router;
};

export default createAdminOrderRoutes;

import express from "express";
import * as orderController from "../controllers/orderController.js";
import { protect, protectAdmin } from "../middleware/protectMiddleware.js";


const createOrderRoutes = (collections) => {
  // 🧠 Inject collections to the controller
  orderController.injectCollections({
    orders: collections.orders,
    products: collections.products,
    users: collections.users, // optional for now
  });

  const router = express.Router();

  // Routes
  router.post("/", protect(), orderController.createOrder);
  router.get("/my", protect(), orderController.getUserOrders);
  router.get("/", protectAdmin(), orderController.getAllOrders);
  router.patch("/:orderId/status", protectAdmin(), orderController.updateOrderStatus);
  router.patch("/:orderId/payment", protectAdmin(), orderController.updatePaymentStatus);
  router.patch("/:orderId/cancel", protect(), orderController.cancelOrder);

  return router;
};

export default createOrderRoutes;

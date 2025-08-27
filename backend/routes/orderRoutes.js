import express from "express";
import * as orderController from "../controllers/orderController.js";
import { protect, protectAdmin } from "../middleware/protectMiddleware.js";
import { body, param } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";

const createOrderRoutes = (collections) => {
  // Inject collections into the controller
  orderController.injectCollections({
    orders: collections.orders,
    products: collections.products,
    users: collections.users,
  });

  const router = express.Router();

  // Validators
  const orderIdParam = [
    param("orderId").isMongoId().withMessage("Invalid order ID format"),
  ];

  // --- Routes ---
  // Create order
  router.post(
    "/",
    protect(),
    [
      body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
      body("items.*.productId").isMongoId().withMessage("Invalid product ID in items"),
      body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
      body("paymentMethod").optional().isIn(["mpesa", "cash", "card"]).withMessage("Invalid payment method"),
      body("shippingAddress").optional().isObject(),
    ],
    validateRequest,
    orderController.createOrder
  );

  // Get all orders for the logged-in user
  router.get("/my", protect(), orderController.getUserOrders);

  // Get all orders for admin
  router.get("/", protectAdmin(), orderController.getAllOrders);

  // Get single order by ID (only owner or admin)
  router.get("/:orderId", protect(), orderIdParam, validateRequest, orderController.getOrderById);

  // Update order status (admin)
  router.patch("/:orderId/status", protectAdmin(), orderIdParam, validateRequest, orderController.updateOrderStatus);

  // Update payment status (admin)
  router.patch("/:orderId/payment", protectAdmin(), orderIdParam, validateRequest, orderController.updatePaymentStatus);

  // Cancel order (user)
  router.patch("/:orderId/cancel", protect(), orderIdParam, validateRequest, orderController.cancelOrder);

  return router;
};

export default createOrderRoutes;

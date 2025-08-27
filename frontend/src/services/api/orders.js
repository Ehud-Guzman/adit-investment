// src/services/api/orders.js
import { api } from "./index";

/**
 * 🛒 Create a new order
 * @param {Object} orderData - cart items, shipping, etc.
 */
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

/**
 * 👤 Fetch logged-in user's own orders
 */
export const fetchMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

/**
 * 🗑️ Cancel an order (user-initiated)
 * @param {string} orderId
 */
export const cancelOrder = async (orderId) => {
  const res = await api.patch(`/orders/${orderId}/cancel`);
  return res.data;
};

/**
 * 👑 Fetch all orders (admin only)
 */
export const fetchAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

/**
 * 🔧 Update order status (admin only)
 * @param {string} orderId
 * @param {string} status - pending | shipped | delivered | cancelled
 */
export const updateOrderStatus = async ({ orderId, status }) => {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
  return res.data;
};

/**
 * 💳 Update payment status (admin only)
 * @param {string} orderId
 * @param {string} paymentStatus - paid | unpaid | refunded
 */
export const updatePaymentStatus = async ({ orderId, paymentStatus }) => {
  const res = await api.patch(`/orders/${orderId}/payment`, { paymentStatus });
  return res.data;
};

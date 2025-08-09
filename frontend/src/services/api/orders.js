// src/services/api/orders.js
import { api } from "./index";

// 🧾 Create a new order (Frontend ➡️ Backend)
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

// 🧾 Fetch all admin orders
export const fetchAll = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

// 🧾 Fetch logged-in user's own orders
export const fetchMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

// 🔧 Update order status
export const updateStatus = async ({ orderId, status }) => {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
 
  return res.data;
};

// 💳 Update payment status
export const updatePaymentStatus = async ({ orderId, paymentStatus }) => {
  const res = await api.patch(`/orders/${orderId}/payment`, { paymentStatus });
  return res.data;
};

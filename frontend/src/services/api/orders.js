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

// 🔧 Update order status
export const updateStatus = async ({ orderId, status }) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return res.data;
};

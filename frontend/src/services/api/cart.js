// src/services/api/cart.js
import { api } from "./index";

// 📦 GET: Fetch authenticated user's entire cart
export const getCart = async () => {
  try {
    const res = await api.get("/cart");
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) return []; // Not logged in = empty cart
    console.error("Get cart error:", formatError(error, "/cart"));
    throw error;
  }
};

// 🤝 POST: Merge guest cart with user’s server-side cart
export const mergeGuestCart = async (guestCart = []) => {
  try {
    const res = await api.post("/cart/merge", { items: guestCart });
    return res.data;
  } catch (error) {
    console.error("Cart merge error:", formatError(error, "/cart/merge"));
    throw error;
  }
};

// ➕ POST: Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid product ID");
  }

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum < 1) {
    throw new Error("Quantity must be a positive number");
  }

  try {
    const res = await api.post("/cart", { productId, quantity: quantityNum });
    return res.data;
  } catch (error) {
    console.error("Add to cart error:", formatError(error, "/cart", { productId, quantity }));
    throw error;
  }
};

// 🔁 PUT: Update item quantity
export const updateCartItem = async (cartItemId, quantity) => {
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("Invalid cart item ID");
  }

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum < 1) {
    throw new Error("Quantity must be a positive number");
  }

  try {
    const res = await api.put(`/cart/${cartItemId}`, { quantity: quantityNum });
    return res.data;
  } catch (error) {
    console.error("Update cart item error:", formatError(error, `/cart/${cartItemId}`, { quantity }));
    throw error;
  }
};

// ❌ DELETE: Remove item from cart
export const removeFromCart = async (cartItemId) => {
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("Invalid cart item ID");
  }

  try {
    const res = await api.delete(`/cart/${cartItemId}`);
    return res.data;
  } catch (error) {
    console.error("Remove from cart error:", formatError(error, `/cart/${cartItemId}`));
    throw error;
  }
};

// 🧠 GET: Retrieve cart with enriched product info
export const getCartWithDetails = async () => {
  try {
    const res = await api.get("/cart/details");
    return res.data;
  } catch (error) {
    console.error("Get cart details error:", formatError(error, "/cart/details"));
    throw error;
  }
};

// ✨ Shortcut wrapper for clean quantity updates
export const updateCartQuantity = ({ cartItemId, quantity }) => {
  return updateCartItem(cartItemId, quantity);
};

// 🧹 DELETE: Clear the entire cart
export const clearCart = async () => {
  try {
    const res = await api.delete("/cart/clear");
    return res.data;
  } catch (error) {
    console.error("Clear cart error:", formatError(error, "/cart/clear"));
    throw error;
  }
};

// 🛠️ Helper to format error logs consistently
const formatError = (error, endpoint, context = {}) => {
  return {
    status: error.response?.status || "N/A",
    message: error.response?.data?.message || error.message,
    endpoint,
    context,
  };
};

// ✅ Export group for flexible named or object import
export const cart = {
  getCart,
  mergeGuestCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartWithDetails,
  updateCartQuantity,
  clearCart,
};

export default cart;

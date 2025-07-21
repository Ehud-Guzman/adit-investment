import { api } from "./index";

// 🛒 Fetch entire cart
export const getCart = async () => {
  try {
    const res = await api.get("/cart");
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) return [];
    throw error;
  }
};

// 🤝 Merge guest cart into user's server cart
export const mergeGuestCart = async (guestCart) => {
  try {
    const res = await api.post("/cart/merge", { items: guestCart });
    return res.data;
  } catch (error) {
    console.error("Cart merge error:", error);
    throw error;
  }
};

// ➕ Add item to cart
export const addToCart = (productId, quantity = 1) => {
  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid product ID");
  }

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum < 1) {
    throw new Error("Quantity must be at least 1");
  }

  return api
    .post("/cart", {
      productId,
      quantity: quantityNum,
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Add to cart error:", {
        status: error.response?.status,
        data: error.response?.data,
        productId,
        quantity,
        endpoint: "/cart",
      });
      throw error;
    });
};

// 🔁 Update cart item quantity
export const updateCartItem = (cartItemId, quantity) => {
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("Invalid cart item ID");
  }

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum < 1) {
    throw new Error("Quantity must be at least 1");
  }

  return api
    .put(`/cart/${cartItemId}`, { quantity: quantityNum })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Update cart item error:", {
        status: error.response?.status,
        data: error.response?.data,
        cartItemId,
        quantity,
        endpoint: `/cart/${cartItemId}`,
      });
      throw error;
    });
};

// ❌ Remove item from cart
export const removeFromCart = (cartItemId) => {
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("Invalid cart item ID");
  }

  return api
    .delete(`/cart/${cartItemId}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Remove from cart error:", {
        status: error.response?.status,
        data: error.response?.data,
        cartItemId,
        endpoint: `/cart/${cartItemId}`,
      });
      throw error;
    });
};

// 🧠 Get cart with detailed product info
export const getCartWithDetails = () => {
  return api
    .get("/cart/details")
    .then((res) => res.data)
    .catch((error) => {
      console.error("Get cart details error:", {
        status: error.response?.status,
        data: error.response?.data,
        endpoint: "/cart/details",
      });
      throw error;
    });
};

// ✨ Wrapper for clean quantity update
export const updateCartQuantity = ({ cartItemId, quantity }) => {
  return updateCartItem(cartItemId, quantity);
};

// 🧹 Clear entire cart
export const clearCart = async () => {
  try {
    const res = await api.delete("/cart/clear");
    return res.data;
  } catch (error) {
    console.error("Clear cart error:", {
      status: error.response?.status,
      data: error.response?.data,
      endpoint: "/cart/clear",
    });
    throw error;
  }
};


// ✅ Grouped export for flexible importing
export const cart = {
  getCart,
  mergeGuestCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartWithDetails,
  updateCartQuantity,
  clearCart
};

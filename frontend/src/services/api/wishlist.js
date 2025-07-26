// services/api/wishlist.js
import { api } from "./index.js";

/**
 * ✅ Utility to safely extract error info
 */
const formatError = (error) => ({
  status: error.response?.status,
  data: error.response?.data,
});

/**
 * 🧾 Fetch the authenticated user's wishlist.
 * Returns an array of wishlist items: [{ _id, userId, productId }]
 */
export const getWishlist = async () => {
  try {
    const res = await api.get("/wishlist");
    return res.data;
  } catch (error) {
    const { status, data } = formatError(error);

    if (status === 401) return []; // Silent fail for guest

    console.error("❌ Get wishlist error:", {
      status,
      data,
      endpoint: "/wishlist",
    });
    throw error;
  }
};

/**
 * ➕ Add a product to the wishlist (if not already there)
 * @param {string} productId - Valid MongoDB ObjectId string
 */
export const addToWishlist = async (productId) => {
  if (!productId || typeof productId !== "string") {
    throw new Error("❗ Product ID must be a valid string");
  }

  try {
    const res = await api.post("/wishlist", { productId });
    return res.data;
  } catch (error) {
    const { status, data } = formatError(error);

    console.error("❌ Add to wishlist error:", {
      status,
      data,
      productId,
      endpoint: "/wishlist",
    });
    throw error;
  }
};

/**
 * ❌ Remove a wishlist item by its `_id` (not the `productId`)
 * @param {string} wishlistItemId - MongoDB ObjectId of the wishlist entry
 */
export const removeFromWishlist = async (wishlistItemId) => {
  if (!wishlistItemId || typeof wishlistItemId !== "string") {
    throw new Error("❗ Wishlist item ID must be a valid string");
  }

  try {
    const res = await api.delete(`/wishlist/${wishlistItemId}`);
    return res.data;
  } catch (error) {
    const { status, data } = formatError(error);

    console.error("❌ Remove from wishlist error:", {
      status,
      data,
      wishlistItemId,
      endpoint: `/wishlist/${wishlistItemId}`,
    });
    throw error;
  }
};

/**
 * 🧹 Clear all items in the authenticated user's wishlist
 */
export const clearWishlist = async () => {
  try {
    const res = await api.delete("/wishlist/clear");
    return res.data;
  } catch (error) {
    const { status, data } = formatError(error);

    console.error("❌ Clear wishlist error:", {
      status,
      data,
      endpoint: "/wishlist/clear",
    });
    throw error;
  }
};

/**
 * ✅ Grouped exports for easy destructuring
 */
export const wishlist = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};

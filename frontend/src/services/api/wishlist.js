// services/api/wishlist.js
import { api } from "./index.js";

/**
 * 🧾 Fetch the authenticated user's wishlist.
 * Returns an array of wishlist items: [{ _id, userId, productId }]
 */
export const getWishlist = async () => {
  try {
    const res = await api.get("/wishlist");
    return res.data; // Expecting array
  } catch (error) {
    const status = error.response?.status;

    if (status === 401) {
      // Guest user, return empty list without log
      return [];
    }

    console.error("❌ Get wishlist error:", {
      status,
      data: error.response?.data,
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
    console.error("❌ Add to wishlist error:", {
      status: error.response?.status,
      data: error.response?.data,
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
    console.error("❌ Remove from wishlist error:", {
      status: error.response?.status,
      data: error.response?.data,
      wishlistItemId,
      endpoint: `/wishlist/${wishlistItemId}`,
    });
    throw error;
  }
};

/**
 * 🧹 Clears all items in the authenticated user's wishlist
 */
export const clearWishlist = async () => {
  try {
    const res = await api.delete("/wishlist/clear");
    return res.data;
  } catch (error) {
    console.error("❌ Clear wishlist error:", {
      status: error.response?.status,
      data: error.response?.data,
      endpoint: "/wishlist/clear",
    });
    throw error;
  }
};

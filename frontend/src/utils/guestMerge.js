import * as cartAPI from "@/services/api/cart";
import * as wishlistAPI from "@/services/api/wishlist";
import { toast } from "react-toastify";
import { normalizeCartItems } from "@/utils/cartNormalizer";




// 🔐 MongoDB ObjectId validator
const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

// 💡 Safe JSON parser
const parseJSON = (raw, fallback = []) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    console.warn("⚠️ Corrupted or malformed guest data in localStorage");
    return fallback;
  }
};

/**
 * 🧠 Merges guest cart and wishlist into the authenticated user’s account.
 * Normalizes everything, handles failures, clears localStorage.
 * @returns {Object} { cart: Array, wishlist: Array }
 */
export const mergeGuestData = async () => {
  // 🔍 Load + validate guest cart
  const guestCart = parseJSON(localStorage.getItem("guest_cart")).filter(
    (item) =>
      isValidObjectId(item?.productId) &&
      Number(item?.quantity) > 0 &&
      Number.isFinite(item?.quantity)
  );

  // 💖 Load + validate guest wishlist
  const rawWishlist = parseJSON(localStorage.getItem("guest_wishlist"));
  const guestWishlist = rawWishlist
    .map((item) => {
      if (typeof item === "string" && isValidObjectId(item)) return item;
      if (typeof item === "object" && isValidObjectId(item?.productId))
        return item.productId;
      return null;
    })
    .filter(isValidObjectId);

  // 🚪 Skip if nothing to merge
  if (!guestCart.length && !guestWishlist.length) {
    return { cart: [], wishlist: [] };
  }

  let cartMerged = 0;
  let wishlistMerged = 0;
  let wishlistFailed = 0;

  if (import.meta.env.DEV) {
    console.groupCollapsed("📦 Merging Guest Data");
    console.log("🛒 Guest Cart:", guestCart);
    console.log("💖 Guest Wishlist:", guestWishlist);
  }

  // --- 🛒 Merge Cart ---
  let mergedCartItems = [];
  try {
    if (guestCart.length) {
      const res = await cartAPI.mergeGuestCart(guestCart);
      mergedCartItems = Array.isArray(res?.items) ? res.items : [];
      cartMerged = guestCart.length;
    }
  } catch (err) {
    console.error("❌ Guest cart merge failed:", err?.response?.data || err.message);
  }

  // --- 💖 Merge Wishlist ---
  let mergedWishlistItems = [];
  if (guestWishlist.length) {
    const results = await Promise.allSettled(
      guestWishlist.map((id) => wishlistAPI.addToWishlist(id))
    );

    mergedWishlistItems = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    wishlistMerged = mergedWishlistItems.length;
    wishlistFailed = results.length - wishlistMerged;
  }

  // 🧹 Clean up guest localStorage
  localStorage.removeItem("guest_cart");
  localStorage.removeItem("guest_wishlist");

  if (import.meta.env.DEV) {
    console.table({
      "Cart Items Merged": cartMerged,
      "Wishlist Items Merged": wishlistMerged,
      "Wishlist Merge Failures": wishlistFailed,
    });
    console.groupEnd();
  }

  // 🔔 Notify user
  const messages = [];
  if (cartMerged > 0)
    messages.push(`🛒 ${cartMerged} cart item${cartMerged > 1 ? "s" : ""}`);
  if (wishlistMerged > 0)
    messages.push(`💖 ${wishlistMerged} wishlist item${wishlistMerged > 1 ? "s" : ""}`);

  if (messages.length > 0) {
    toast.info(`${messages.join(" & ")} merged from guest mode`, { autoClose: 3000 });
  }

  // 🧠 Normalized return
  return {
    cart: normalizeCartItems(mergedCartItems),
    wishlist: mergedWishlistItems,
  };
};

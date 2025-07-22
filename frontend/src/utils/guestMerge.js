import * as cartAPI from "@/services/api/cart";
import * as wishlistAPI from "@/services/api/wishlist";
import { toast } from "react-toastify";
import { toastGuard } from "@/utils/toastControl";


/**
 * 🔐 Merge guest cart & wishlist into authenticated user account
 * Runs once after login/register
 */
export const mergeGuestData = async () => {
  const isValidObjectId = (id) =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

  const parseJSON = (raw, fallback = []) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      console.warn("⚠️ Corrupted guest data in localStorage");
      return fallback;
    }
  };

  const guestCart = parseJSON(localStorage.getItem("guest_cart")).filter(
    (item) =>
      isValidObjectId(item?.productId) &&
      Number(item?.quantity) > 0 &&
      Number.isFinite(item?.quantity)
  );

  const rawWishlist = parseJSON(localStorage.getItem("guest_wishlist"));
  const guestWishlist = rawWishlist
    .map((item) => {
      if (typeof item === "string" && isValidObjectId(item)) return item;
      if (typeof item === "object" && isValidObjectId(item?.productId))
        return item.productId;
      return null;
    })
    .filter(isValidObjectId);

  if (!guestCart.length && !guestWishlist.length) return;

  let cartMerged = 0;
  let wishlistMerged = 0;
  let wishlistFailed = 0;

  // 👀 Log quietly for debugging (only in dev)
  if (import.meta.env.DEV) {
    console.groupCollapsed("📦 Merging Guest Data");
    console.log("🛒 Guest Cart:", guestCart);
    console.log("💖 Guest Wishlist:", guestWishlist);
  }

  // Merge cart
  try {
    if (guestCart.length > 0) {
      await cartAPI.mergeGuestCart(guestCart);
      cartMerged = guestCart.length;
    }
  } catch (err) {
    console.error("❌ Guest cart merge failed:", err?.response?.data || err.message);
  }

  // Merge wishlist
  if (guestWishlist.length > 0) {
    const results = await Promise.allSettled(
      guestWishlist.map((productId) =>
        wishlistAPI.addToWishlist(productId)
      )
    );

    results.forEach((res) => {
      if (res.status === "fulfilled") wishlistMerged++;
      else wishlistFailed++;
    });
  }

  // 🧹 Cleanup localStorage
  localStorage.removeItem("guest_cart");
  localStorage.removeItem("guest_wishlist");

  if (import.meta.env.DEV) {
    console.table({
      "Cart Items Merged": cartMerged,
      "Wishlist Items Merged": wishlistMerged,
      "Wishlist Failures": wishlistFailed,
    });
    console.groupEnd();
  }

  // 🎯 One toast only, if anything actually merged
  const messages = [];
  if (cartMerged > 0) messages.push(`🛒 ${cartMerged} cart item${cartMerged > 1 ? "s" : ""}`);
  if (wishlistMerged > 0) messages.push(`💖 ${wishlistMerged} wishlist item${wishlistMerged > 1 ? "s" : ""}`);

  if (messages.length) {
    toast.info(`${messages.join(" & ")} merged from guest mode`, { autoClose: 3000 });
  }
};

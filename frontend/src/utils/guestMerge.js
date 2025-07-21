import * as cartAPI from "@/services/api/cart";
import * as wishlistAPI from "@/services/api/wishlist";
import { toast } from "react-toastify";

/**
 * 🔐 Merge guest cart & wishlist into user account after login/register
 * @returns {Promise<void>}
 */
export const mergeGuestData = async () => {
  const isValidObjectId = (id) =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

  const parseJSON = (raw, fallback = []) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      console.warn("⚠️ Corrupted localStorage guest data");
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

  console.groupCollapsed("📦 Merging Guest Data");
  console.log("🛒 Guest Cart:", guestCart);
  console.log("💖 Guest Wishlist:", guestWishlist);

  let cartMerged = 0;
  let wishlistMerged = 0;
  let wishlistFailed = 0;

  try {
    if (guestCart.length > 0) {
      await cartAPI.mergeGuestCart(guestCart);
      cartMerged = guestCart.length;
      console.info(`✅ Merged ${cartMerged} cart item(s)`);
    }
  } catch (err) {
    console.error("❌ Cart merge failed:", err?.response?.data || err.message);
  }

  const wishlistResults = await Promise.allSettled(
    guestWishlist.map(async (productId) => {
      try {
        await wishlistAPI.addToWishlist(productId);
        wishlistMerged++;
      } catch (err) {
        wishlistFailed++;
        console.error(`❌ Wishlist failed for: ${productId}`, err.message);
      }
    })
  );

  localStorage.removeItem("guest_cart");
  localStorage.removeItem("guest_wishlist");

  console.table({
    "Cart Items Merged": cartMerged,
    "Wishlist Items Merged": wishlistMerged,
    "Wishlist Failures": wishlistFailed,
  });
  console.groupEnd();

  if (cartMerged > 0) {
    toast.success(`🛒 ${cartMerged} cart item(s) merged into your account`);
  }

  if (wishlistMerged > 0) {
    toast.success(`💖 ${wishlistMerged} wishlist item(s) added`);
  }
};

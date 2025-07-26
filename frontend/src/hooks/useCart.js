// hooks/useCart.js

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { cart as cartAPI } from "@/services/api/index";
import { toastGuard } from "@/utils/toastControl";
import { normalizeCartItems } from "@/utils/cartNormalizer";

const toastIds = {
  add: "cart-toast-add",
  update: "cart-toast-update",
  remove: "cart-toast-remove",
  clear: "cart-toast-clear",
  error: "cart-toast-error",
};

const isMergePending = () =>
  typeof window !== "undefined" && window.__mergePending === true;

// 🔐 Validate MongoDB ObjectId format
const isValidObjectId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

// 🗃️ Load guest cart from localStorage
const getGuestCart = () => {
  try {
    const raw = localStorage.getItem("guest_cart");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid guest cart");

    return parsed.filter(
      (i) =>
        isValidObjectId(i?.productId) &&
        i.quantity > 0 &&
        typeof i.quantity === "number"
    );
  } catch {
    localStorage.removeItem("guest_cart");
    return [];
  }
};

// 💾 Save guest cart safely
const setGuestCart = (cart) => {
  try {
    const safe = cart.filter(
      (i) =>
        isValidObjectId(i?.productId) &&
        i.quantity > 0 &&
        typeof i.quantity === "number"
    );
    localStorage.setItem("guest_cart", JSON.stringify(safe));
  } catch {
    localStorage.removeItem("guest_cart");
  }
};

export const useCart = ({ isAuthenticated = false, isLoadingUser = false } = {}) => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    enabled: !isLoadingUser && !isMergePending(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const rawCart = isAuthenticated
        ? await cartAPI.getCart()
        : getGuestCart();
      return await normalizeCartItems(rawCart);
    },
    retry: (count, error) => {
      const status = error?.response?.status;
      return count < 3 && ![400, 401].includes(status);
    },
  });

  useEffect(() => {
    if (cartQuery.isError && !cartQuery.data) {
      const message =
        cartQuery.error?.response?.data?.message ||
        cartQuery.error?.message ||
        "Failed to load cart";
      const status = cartQuery.error?.response?.status;
      if (![400, 401].includes(status)) {
        toastGuard.once(toastIds.error, message, "error", 3000);
      }
    }
  }, [cartQuery.isError, cartQuery.error, cartQuery.data]);

  const invalidateCart = async () => {
    await queryClient.invalidateQueries(["cart"]);
  };

  const addToCart = async (productId, quantity = 1) => {
    const pid = String(productId);
    const qty = Number(quantity);
    if (!isValidObjectId(pid) || isNaN(qty) || qty < 1) {
      console.warn("⛔ Invalid add to cart input:", { pid, qty });
      throw new Error("Invalid product or quantity");
    }

    try {
      if (isAuthenticated) {
        const updated = await cartAPI.addToCart(pid, qty);
        queryClient.setQueryData(["cart"], await normalizeCartItems(updated));
      } else {
        const guestCart = getGuestCart();
        const existing = guestCart.find((item) => item.productId === pid);
        if (existing) {
          existing.quantity += qty;
        } else {
          guestCart.push({ id: `guest-${Date.now()}`, productId: pid, quantity: qty });
        }
        setGuestCart(guestCart);
        queryClient.setQueryData(["cart"], await normalizeCartItems(guestCart));
      }

      toastGuard.once(toastIds.add, "🛒 Added to cart", "success", 1000);
      await invalidateCart();
    } catch (err) {
      toastGuard.once(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to add to cart",
        "error",
        2500
      );
      throw err;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    const qty = Number(quantity);
    if (!cartItemId || isNaN(qty) || qty < 1) {
      throw new Error("Invalid cart item ID or quantity");
    }

    try {
      if (isAuthenticated) {
        const updated = await cartAPI.updateCartItem(cartItemId, qty);
        queryClient.setQueryData(["cart"], await normalizeCartItems(updated));
      } else {
        const guestCart = getGuestCart();
        const item = guestCart.find((item) => item.id === cartItemId);
        if (item) {
          item.quantity = qty;
          setGuestCart(guestCart);
          queryClient.setQueryData(["cart"], await normalizeCartItems(guestCart));
        }
      }

      toastGuard.once(toastIds.update, "✅ Cart updated", "success", 2000);
      await invalidateCart();
    } catch (err) {
      toastGuard.once(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to update cart",
        "error",
        3000
      );
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!cartItemId) throw new Error("Cart item ID is required");

    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(cartItemId);
        const current = queryClient.getQueryData(["cart"]) || [];
        const filtered = current.filter((item) => item.id !== cartItemId);
        queryClient.setQueryData(["cart"], filtered);
      } else {
        const guestCart = getGuestCart();
        const filtered = guestCart.filter((item) => item.id !== cartItemId);
        setGuestCart(filtered);
        queryClient.setQueryData(["cart"], await normalizeCartItems(filtered));
      }

      toastGuard.once(toastIds.remove, "🗑️ Removed from cart", "success", 2000);
      await invalidateCart();
    } catch (err) {
      toastGuard.once(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to remove item",
        "error",
        3000
      );
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem("guest_cart");
      }
      queryClient.setQueryData(["cart"], []);
      toastGuard.once(toastIds.clear, "🧼 Cart cleared", "success", 2000);
      await invalidateCart();
    } catch (err) {
      toastGuard.once(toastIds.error, "🚫 Failed to clear cart", "error", 3000);
    }
  };

  return {
    cart: Array.isArray(cartQuery.data) ? cartQuery.data : [],
    cartCount: Array.isArray(cartQuery.data)
      ? cartQuery.data.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : 0,
    isLoading: cartQuery.isLoading,
    isFetching: cartQuery.isFetching,
    error: cartQuery.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetchCart: cartQuery.refetch,
  };
};

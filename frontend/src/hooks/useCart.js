// hooks/useCart.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { cart as cartAPI } from "@/services/api/index.js";
import { safeToast } from "@/utils/toastManager";

// ✅ Central toast keys
const toastIds = {
  add: "cart-toast-add",
  update: "cart-toast-update",
  remove: "cart-toast-remove",
  clear: "cart-toast-clear",
  error: "cart-toast-error",
};

// 🧠 Guest cart utils
const getGuestCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("guest_cart"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem("guest_cart");
    return [];
  }
};

const setGuestCart = (cart) => {
  try {
    localStorage.setItem("guest_cart", JSON.stringify(cart));
  } catch {
    localStorage.removeItem("guest_cart");
  }
};

export const useCart = ({
  isAuthenticated = false,
  isLoadingUser = false,
} = {}) => {
  const queryClient = useQueryClient();
  const didRefetch = useRef(false);

  // 🛒 Cart query
  const cartQuery = useQuery({
    queryKey: ["cart"],
    enabled: !isLoadingUser,
    staleTime: 60 * 1000,
    queryFn: async () =>
      isAuthenticated
        ? await cartAPI.getCart().then((data) =>
            Array.isArray(data)
              ? data.map((item) => ({ ...item, id: item._id }))
              : []
          )
        : getGuestCart(),
    retry: (count, error) => {
      const status = error?.response?.status;
      return count < 3 && ![400, 401].includes(status);
    },
  });

  // 🚨 Handle load errors
  useEffect(() => {
    if (cartQuery.isError && !cartQuery.data) {
      const error = cartQuery.error;
      const message = error?.response?.data?.message || error.message;
      const status = error?.response?.status;

      if (![400, 401].includes(status)) {
        safeToast(toastIds.error, message, "error", 3000);
      }
    }
  }, [cartQuery.isError, cartQuery.error, cartQuery.data]);

  // 🔁 Re-fetch after login
  useEffect(() => {
    if (isAuthenticated && !isLoadingUser && !didRefetch.current) {
      queryClient.invalidateQueries(["cart"]);
      didRefetch.current = true;
    }
  }, [isAuthenticated, isLoadingUser, queryClient]);

  const invalidateCart = async () => {
    await queryClient.invalidateQueries(["cart"]);
  };

  // ➕ Add to cart
  const addToCart = async (productId, quantity = 1) => {
    const pid = String(productId);
    const qty = Number(quantity);
    if (!pid || isNaN(qty) || qty < 1) throw new Error("Invalid product or quantity");

    try {
      if (isAuthenticated) {
        await cartAPI.addToCart(pid, qty);
      } else {
        const guestCart = getGuestCart();
        const existing = guestCart.find((item) => item.productId === pid);
        if (existing) existing.quantity += qty;
        else guestCart.push({ id: `guest-${Date.now()}`, productId: pid, quantity: qty });

        setGuestCart(guestCart);
        queryClient.setQueryData(["cart"], guestCart);
      }

      safeToast(toastIds.add, "🛒 Added to cart", "success", 2000);
      await invalidateCart();
    } catch (err) {
      safeToast(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to add to cart",
        "error",
        3000
      );
      throw err;
    }
  };

  // ✏️ Update quantity
  const updateCartItem = async (cartItemId, quantity) => {
    const qty = Number(quantity);
    if (!cartItemId || isNaN(qty) || qty < 1) throw new Error("Invalid item or quantity");

    try {
      if (isAuthenticated) {
        await cartAPI.updateCartItem(cartItemId, qty);
      } else {
        const guestCart = getGuestCart();
        const item = guestCart.find((item) => item.id === cartItemId);
        if (item) {
          item.quantity = qty;
          setGuestCart(guestCart);
          queryClient.setQueryData(["cart"], guestCart);
        }
      }

      safeToast(toastIds.update, "✅ Cart updated", "success", 2000);
      await invalidateCart();
    } catch (err) {
      safeToast(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to update cart",
        "error",
        3000
      );
      throw err;
    }
  };

  // ❌ Remove item
  const removeFromCart = async (cartItemId) => {
    if (!cartItemId) throw new Error("Cart item ID is required");

    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(cartItemId);
      } else {
        const filtered = getGuestCart().filter(
          (item) =>
            item.id !== cartItemId &&
            item._id !== cartItemId &&
            item.productId !== cartItemId
        );
        setGuestCart(filtered);
        queryClient.setQueryData(["cart"], filtered);
      }

      safeToast(toastIds.remove, "🗑️ Removed from cart", "success", 2000);
      await invalidateCart();
    } catch (err) {
      safeToast(
        toastIds.error,
        err?.response?.data?.message || err.message || "Failed to remove item",
        "error",
        3000
      );
      throw err;
    }
  };

  // 🧼 Clear all
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem("guest_cart");
        queryClient.setQueryData(["cart"], []);
      }

      safeToast(toastIds.clear, "🧼 Cart cleared", "success", 2000);
      await invalidateCart();
    } catch (err) {
      safeToast(toastIds.error, "🚫 Failed to clear cart", "error", 3000);
    }
  };

  return {
    cart: Array.isArray(cartQuery.data) ? cartQuery.data : [],
    cartCount: Array.isArray(cartQuery.data)
      ? cartQuery.data.reduce((sum, item) => sum + (item.quantity || 1), 0)
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


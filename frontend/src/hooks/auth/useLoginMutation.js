import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth";
import { toast } from "react-toastify";
import { mergeGuestData } from "@/utils/guestMerge";
import { normalizeCartItems } from "@/utils/cartNormalizer";

/**
 * 🧠 Custom React Query mutation for handling login logic.
 * Handles:
 * - Secure token storage
 * - Guest cart/wishlist merge
 * - Stable cache hydration
 * - Optional navigation
 */
export const useLoginMutation = ({ updateTokens, queryClient, navigate }) => {
  return useMutation({
    mutationFn: login,

    onSuccess: async (res, variables) => {
      const { token, user } = res;

      if (!token || !user) {
        throw new Error("Invalid login response. Try again.");
      }

      console.log("✅ Login Success:", { user });

      // 🔐 Save token to memory/localStorage/etc.
      updateTokens(token);

      // 🛡️ Set global merge lock
      window.__mergePending = true;

      // ⏱ Optional delay to let cookies/sessions propagate
      await new Promise((res) => setTimeout(res, 200));

      let mergedCart = [];
      let mergedWishlist = [];

      try {
        console.log("🧩 Merging guest data...");
        const merged = await mergeGuestData();
        mergedCart = merged?.cart || [];
        mergedWishlist = merged?.wishlist || [];
        console.log("✅ Guest merge result:", { mergedCart, mergedWishlist });
      } catch (err) {
        console.warn("⚠️ Guest merge failed:", err.message);
      }

      // 🧠 Inject merged user
      queryClient.setQueryData(["auth-user"], user);

      // 🧪 Debug current cart cache
      console.log("🧪 Cart cache before patch:", queryClient.getQueryData(["cart"]));

      // 💾 Inject merged cart/wishlist into cache
      if (mergedCart.length > 0) {
        queryClient.setQueryData(["cart"], normalizeCartItems(mergedCart));
      }

      if (mergedWishlist.length > 0) {
        queryClient.setQueryData(["wishlist"], mergedWishlist);
      }

      // ❌ Do NOT invalidate cart/wishlist immediately — keep cache fresh
      // queryClient.invalidateQueries(["cart"]);
      // queryClient.invalidateQueries(["wishlist"]);

      // 🧪 Post-patch check
      console.log("🧪 Cart cache after patch:", queryClient.getQueryData(["cart"]));

      // 🧹 Release merge lock
      setTimeout(() => {
        window.__mergePending = false;
      }, 1000); // Let things settle before any automatic refetches

      // 🎉 User feedback
      toast.success(`🎉 Welcome back, ${user.name || "legend"}!`);

      // 🚀 Redirect if provided
      if (variables?.redirect) {
        navigate(variables.redirectTo || "/", { replace: true });
      }
    },

    onError: (err) => {
      const status = err?.status || err?.response?.status;
      const raw = err?.message || "Login failed. Please try again.";
      const isUnverified =
        raw.toLowerCase().includes("email not verified") || err?.isUnverified;

      const message =
        status === 401
          ? isUnverified
            ? "Please verify your email before logging in."
            : "Incorrect email or password."
          : raw;

      toast.error(`❌ ${message}`);
      console.warn("🛑 Login error:", err);
    },
  });
};

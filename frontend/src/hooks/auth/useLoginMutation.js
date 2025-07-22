import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth";
import { toast } from "react-toastify";
import { mergeGuestData } from "@/utils/guestMerge";
import { toastGuard } from "@/utils/toastControl";


/**
 * Custom React Query mutation for handling login logic.
 * Handles:
 *  - Secure token storage (access token)
 *  - Guest cart/wishlist merging
 *  - Cache updates for user/cart/wishlist
 *  - Navigation and UI feedback
 */
export const useLoginMutation = ({ updateTokens, queryClient, navigate }) => {
  return useMutation({
    mutationFn: login,

    // 🔥 Fired when login succeeds
    onSuccess: async (res, variables) => {
      const { token, user } = res;

      if (!token || !user) {
        throw new Error("Invalid login response. Try again.");
      }

      // ✅ Save token (refresh is in HttpOnly cookie already)
      updateTokens(token);

      try {
        // Merge local guest data (cart, wishlist) with user's
        await mergeGuestData();
      } catch (err) {
        console.warn("⚠️ Guest merge failed after login:", err.message);
      }

      // 🧠 Update user in global auth cache
      queryClient.setQueryData(["auth-user"], user);

      // 🔄 Refresh related queries (cart, wishlist, etc)
      await Promise.all([
        queryClient.invalidateQueries(["cart"]),
        queryClient.invalidateQueries(["wishlist"]),
        queryClient.refetchQueries(["cart"]),
        queryClient.refetchQueries(["wishlist"]),
      ]);

      // 🎉 User feedback
      toast.success(`🎉 Welcome back, ${user.name || "legend"}!`);

      // 🚀 Navigate if needed
      if (variables?.redirect) {
        navigate(variables.redirectTo || "/", { replace: true });
      }
    },

    // ❌ Fired on login error
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

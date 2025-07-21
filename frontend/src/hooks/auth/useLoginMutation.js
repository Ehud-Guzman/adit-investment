import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/auth";
import { toast } from "react-toastify";
import { mergeGuestData } from "@/utils/guestMerge";

/**
 * Custom React Query mutation for user login.
 * Handles token storage, guest cart merging, and refetching user state.
 */
export const useLoginMutation = ({ updateTokens, queryClient, navigate }) => {
  return useMutation({
    mutationFn: login,

    onSuccess: async ({ token, refreshToken, user }, variables) => {
      if (!token || !refreshToken || !user) {
        throw new Error("Invalid login response. Try again.");
      }

      updateTokens(token, refreshToken);

      try {
        await mergeGuestData(); // 💾 Optional: Merge guest cart/wishlist
      } catch (err) {
        console.warn("⚠️ Guest merge failed after login:", err.message);
      }

      // Cache user globally
      queryClient.setQueryData(["auth-user"], user);

      // Refresh cart & wishlist
      await Promise.all([
        queryClient.invalidateQueries(["cart"]),
        queryClient.invalidateQueries(["wishlist"]),
        queryClient.refetchQueries(["cart"]),
        queryClient.refetchQueries(["wishlist"]),
      ]);

      toast.success(`🎉 Welcome back, ${user.name || "legend"}!`);

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

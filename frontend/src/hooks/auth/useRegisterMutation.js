import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/api/auth";
import { toast } from "react-toastify";

/**
 * Handles user registration mutation.
 * Does NOT expect tokens or user to be returned (email verification flow).
 */
export const useRegisterMutation = ({ setAuthMode }) => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await register(formData);
      if (!res || !res.message) {
        throw new Error("Unexpected server response");
      }
      return res;
    },

    onSuccess: (res) => {
      toast.success(
        res.message || "✅ Registration successful. Check your email to verify your account."
      );

      // Optionally auto-switch to login mode after registration
      if (typeof setAuthMode === "function") {
        setAuthMode("login");
      }
    },

    onError: (err) => {
      const status = err?.response?.status;
      const fallbackMsg = "❌ Registration failed. Please try again.";

      if (status === 409) {
        toast.error("⚠️ That email is already registered.");
      } else {
        toast.error(err?.message || fallbackMsg);
      }

      console.warn("🛑 Registration error:", err);
    },
  });
};

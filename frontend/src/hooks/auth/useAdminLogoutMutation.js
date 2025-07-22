// src/hooks/auth/useAdminLogoutMutation.js
import { useMutation } from "@tanstack/react-query";
import { adminLogout } from "@/services/api/admin/adminActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "@/services/api"; // Axios instance

export function useAdminLogoutMutation({ clearTokens, queryClient }) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      try {
        await adminLogout(); // Optional: invalidate session on backend
      } catch (err) {
        console.warn("⚠️ Backend logout failed, proceeding with client cleanup");
      }

      // 🔐 Fully clear client-side session
      clearTokens();
      delete api.defaults.headers.common["Authorization"];
    },

    onSuccess: () => {
      localStorage.setItem("adminLoggedOut", "1"); // flag for login UI
      queryClient.removeQueries(["adminUser"]);
      toast.success("Logged out successfully");
      navigate("/admin");
    },

    onError: (err) => {
      const msg = err?.message || "Logout failed";
      toast.error(msg);
    },
  });
}

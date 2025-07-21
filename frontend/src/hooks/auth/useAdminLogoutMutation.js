// src/hooks/auth/useAdminLogoutMutation.js
import { useMutation } from "@tanstack/react-query";
import { adminLogout } from "@/services/api/admin/adminActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useAdminLogoutMutation({ clearTokens, queryClient }) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await adminLogout(); // backend logout
      clearTokens();  // clear localStorage token
    },

    onSuccess: () => {
      localStorage.setItem("adminLoggedOut", "1"); // ✅ flag for toast
      queryClient.removeQueries(["adminUser"]);
      toast.success("Logged out successfully");
      navigate("/admin"); // ✅ back to guarded route
    },

    onError: (err) => {
      const msg = err?.message || "Logout failed";
      toast.error(msg);
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminLogin } from "@/services/api/admin/adminActions";
import { api } from "@/services/api"; // 🔐 Axios instance

export function useAdminLoginMutation({ updateTokens, queryClient }) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const { token, user } = await adminLogin(credentials);

      if (!user?.isAdmin) {
        throw new Error("Access denied: Not an admin");
      }

      // ✅ Store token in localStorage
      localStorage.setItem("accessToken", token);

      // ✅ Set Axios default Authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Optional: update your state/store/context
      updateTokens(token);

      return user;
    },

    onSuccess: (adminUser) => {
      toast.success(`Welcome, ${adminUser.name || "Admin"}!`);
      queryClient.invalidateQueries(["adminUser"]);
      navigate("/admin");
    },

    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Admin login failed";
      toast.error(msg);
    },
  });
}

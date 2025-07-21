import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ CORRECT IMPORT FOR ADMIN AUTH
import { adminLogin } from "@/services/api/admin/adminActions";

export function useAdminLoginMutation({ updateTokens, queryClient }) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const { token, user } = await adminLogin(credentials);

      if (!user?.isAdmin) {
        throw new Error("Access denied: Not an admin");
      }

      updateTokens(token);
      return user;
    },

    onSuccess: (adminUser) => {
      toast.success(`Welcome, ${adminUser.name || "Admin"}!`);
      queryClient.invalidateQueries(["adminUser"]);
      navigate("/admin");
    },

    onError: (err) => {
      const msg = err?.message || "Admin login failed";
      toast.error(msg);
    },
  });
}

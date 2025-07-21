import { useQuery } from "@tanstack/react-query";
import { getAdminCurrentUser } from "@/services/api/auth/actions";
import { useNavigate } from "react-router-dom";

export function useAdminUserQuery() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["adminUser"],
    queryFn: async () => {
      const user = await getAdminCurrentUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      if (!user.isAdmin) {
        throw new Error("Access denied: Admins only");
      }

      return user;
    },
    retry: false,
    onError: (err) => {
      console.warn("Admin user fetch failed:", err.message);
      navigate("/admin"); // Redirect to admin login if not allowed
    },
  });
}

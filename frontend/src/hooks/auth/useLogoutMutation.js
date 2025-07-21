// hooks/auth/useLogoutMutation.js
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "@/services/api/auth";

export const useLogoutMutation = ({ clearTokens, queryClient, navigate }) => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearTokens();
      queryClient.setQueryData(["auth-user"], null);
      
      // Preserve cart state for guest session
      const currentCart = queryClient.getQueryData(["cart"]) || [];
      localStorage.setItem("guest_cart", JSON.stringify(currentCart));
      
      // Reset wishlist to guest wishlist
      const guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
      queryClient.setQueryData(
        ["wishlist"],
        guestWishlist.map(id => ({ productId: id }))
      );
      
      // Remove sensitive queries
      queryClient.removeQueries(["user"]);
      
      navigate("/products", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Logout failed");
    }
  });
};
import { markLoggedOut } from '@/services/api/index.js';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      // 1. Mark as logged out in API service (blocks new requests)
      markLoggedOut();
      
      // 2. Cancel all pending queries
      queryClient.cancelQueries();
      
      // 3. Clear auth state
      authLogout();
      
      // 4. Clear query cache
      queryClient.removeQueries();
      
      // 5. Optional: Reset guest wishlist if needed
      // localStorage.removeItem('guest_wishlist');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
};
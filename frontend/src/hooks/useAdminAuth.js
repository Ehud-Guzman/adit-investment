import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTokenManager } from "./auth/useAdminTokenManager";
import { useAdminUserQuery } from "./auth/useAdminUserQuery";
import { useAdminLoginMutation } from "./auth/useAdminLoginMutation";
import { useAdminLogoutMutation } from "./auth/useAdminLogoutMutation";

export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token, updateTokens, clearTokens } = useTokenManager();

  const userQuery = useAdminUserQuery(token, updateTokens, clearTokens);
  const loginMutation = useAdminLoginMutation({ updateTokens, queryClient, navigate });
  const logoutMutation = useAdminLogoutMutation({ clearTokens, queryClient, navigate });

return {
  currentUser: userQuery.data,
  isAuthenticated: !!userQuery.data,
  isAdmin: userQuery.data?.isAdmin === true,
  isSuperAdmin: userQuery.data?.role === "superadmin",
  role: userQuery.data?.role || null,
  status: userQuery.data?.status || null,
  isVerified: userQuery.data?.isVerified || false,
  isSuspended: userQuery.data?.status === "suspended" || userQuery.data?.status === "deleted",

  isLoading: userQuery.isLoading,
  login: loginMutation.mutateAsync,
  logout: logoutMutation.mutateAsync,
  loginError: loginMutation.error,
  isLoggingIn: loginMutation.isPending,
  isLoggingOut: logoutMutation.isPending,
};

};

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useTokenManager } from "./auth/useTokenManager";
import { useUserQuery } from "./auth/useUserQuery";
import { useLoginMutation } from "./auth/useLoginMutation";
import { useRegisterMutation } from "./auth/useRegisterMutation";
import { useLogoutMutation } from "./auth/useLogoutMutation";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 🧠 Token logic: handles setting/clearing storage
  const { token, updateTokens, clearTokens } = useTokenManager();

  // 👤 User data query — only runs if token exists
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isSuccess,
  } = useUserQuery(token, updateTokens, clearTokens);

  // 🔐 Auth mutations
  const loginMutation = useLoginMutation({
    updateTokens,
    queryClient,
    navigate,
  });

  const registerMutation = useRegisterMutation({
    updateTokens,
    queryClient,
    navigate,
  });

  const logoutMutation = useLogoutMutation({
    clearTokens,
    queryClient,
    navigate,
  });

  // 🔍 Auth state
  const isAuthenticated = !!currentUser;
  const isGuest = isSuccess && !currentUser;
  const isAdmin = currentUser?.isAdmin === true;

  return {
    // 👤 User state
    currentUser,
    isAuthenticated,
    isGuest,
    isAdmin,

    // 🔄 Status flags
    isLoadingUser,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // 🛠️ Mutation actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // 🚨 Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
};

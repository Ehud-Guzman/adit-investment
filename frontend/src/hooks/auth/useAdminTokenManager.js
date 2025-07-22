// src/hooks/auth/useAdminTokenManager.js
const ADMIN_TOKEN_KEY = "adminAccessToken";

export const useTokenManager = () => {
  const getToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

  const updateTokens = (newToken) => {
    if (newToken) {
      localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  return {
    token: getToken(),
    updateTokens,
    clearTokens,
  };
};

import { TOKEN_KEY } from "./authTokens";

export const getAuthError = (error) => ({
  message: error?.response?.data?.message || "Authentication error",
  isAuthError: error?.response?.status === 401,
  isGuest: !localStorage.getItem(TOKEN_KEY),
  isServerError: error?.response?.status >= 500,
  isBadRequest: error?.response?.status === 400,
});

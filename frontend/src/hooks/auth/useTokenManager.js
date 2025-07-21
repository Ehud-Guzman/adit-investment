import { useEffect, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAuthToken,
  setAuthToken,
  removeAccessToken,
  removeRefreshToken,
  getRefreshController,
  markLoggedOut,
} from "@/utils/authTokens";
import { api } from "@/services/api/index.js";

export const useTokenManager = () => {
  const [token, setToken] = useState(() => getAccessToken());

  useEffect(() => {
    const tryRefresh = async () => {
      if (!token && getRefreshToken()) {
        try {
          const controller = getRefreshController();
          const { accessToken, refreshToken } = await controller.startRefresh();
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setToken(accessToken);
          setAuthToken(accessToken);
        } catch (err) {
          console.warn("🧃 Token refresh failed on mount:", err.message);
          clearTokens();
        }
      } else {
        setAuthToken(token);
      }
    };

    tryRefresh();
  }, []);

  useEffect(() => {
    const sync = () => {
      const newToken = getAccessToken();
      if (newToken !== token) {
        setToken(newToken);
        setAuthToken(newToken);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [token]);

  const updateTokens = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAuthToken(accessToken);
    setToken(accessToken);
  };

  const clearTokens = () => {
    removeAccessToken();
    removeRefreshToken();
    clearAuthToken();
    markLoggedOut();
    setToken(null);
  };

  return { token, setToken, updateTokens, clearTokens };
};

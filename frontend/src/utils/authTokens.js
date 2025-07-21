import api from "../services/api/index.js"; // Your Axios instance

// 🏷️ LocalStorage Keys
export const TOKEN_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";

// 🎫 Token Getters/Setters
export const getAccessToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return isValidToken(token) ? token : null;
};

export const setAccessToken = (token) => {
  if (isValidToken(token)) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRefreshToken = () => {
  const token = localStorage.getItem(REFRESH_KEY);
  return isValidToken(token) ? token : null;
};

export const setRefreshToken = (token) => {
  if (isValidToken(token)) {
    localStorage.setItem(REFRESH_KEY, token);
  }
};

export const removeRefreshToken = () => localStorage.removeItem(REFRESH_KEY);

// 🔐 Axios Token Header Management
export const setAuthToken = (token) => {
  if (isValidToken(token)) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common.Authorization;
};

// ✅ Helper: Checks if a token is legit (non-empty string)
export const isValidToken = (token) => {
  return !!token && typeof token === "string" && token !== "null" && token !== "undefined";
};

// 🔁 Refresh Token Controller
let refreshInProgress = false;
let refreshPromise = null;

export const getRefreshController = () => ({
  isRefreshing: () => refreshInProgress,

  startRefresh: () => {
    if (!refreshInProgress) {
      refreshInProgress = true;

      refreshPromise = api.post("/auth/refresh")
        .then((res) => {
          const accessToken = res.data?.token || res.data?.accessToken;
          const refreshToken = res.data?.refreshToken;

          if (!isValidToken(accessToken)) throw new Error("No valid access token returned");

          setAccessToken(accessToken);
          setAuthToken(accessToken);

          if (isValidToken(refreshToken)) {
            setRefreshToken(refreshToken);
          }

          return { accessToken, refreshToken };
        })
        .catch((err) => {
          console.error("🔁 Refresh failed:", err.message);
          throw err;
        });
    }

    return refreshPromise;
  },

  getRefreshPromise: () => refreshPromise,

  resetRefresh: () => {
    refreshInProgress = false;
    refreshPromise = null;
  },
});

// ❌ Logout Cleanup Utility
export const markLoggedOut = () => {
  removeAccessToken();
  removeRefreshToken();
  clearAuthToken();

  getRefreshController().resetRefresh();

  console.log("👋 You’ve been securely logged out.");
};

// src/api/index.js
import axios from "axios";
import { TOKEN_KEY } from "./auth"; // Your token localStorage key

// 🌍 Base API URL — fallback to localhost if env is missing
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// 🔧 Create Axios instance
const api = axios.create({
  baseURL,
  timeout: 20000,                // ⏱ 20s timeout
  withCredentials: true,         // 🍪 Needed for cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔥 API BaseURL:", baseURL); // ✅ Keep in dev, remove in prod

// 🚀 REQUEST INTERCEPTOR — Attach access token from localStorage (if present)
api.interceptors.request.use(
  (config) => {
    if (config._suppressAuth) return config; // Allow bypassing auth

    const token = localStorage.getItem(TOKEN_KEY); // e.g., "adminAccessToken"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 RESPONSE INTERCEPTOR — Handle token refresh automatically
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const isAuthEndpoint = /\/auth\/(login|refresh|register)/.test(original?.url || "");
    const isPublic = /\/(products|health|ping)/.test(original?.url || "");

    // 💥 Only handle 401 once per request
    if (status === 401 && !original._retry && !isAuthEndpoint && !isPublic) {
      original._retry = true;

      try {
        const refreshRes = await api.post("/auth/refresh", null, {
          _suppressAuth: true, // don't attach token again
        });

        const newAccessToken = refreshRes.data?.accessToken || refreshRes.data?.token;
        const newRefreshToken = refreshRes.data?.refreshToken;

        if (!newAccessToken) throw new Error("Refresh succeeded but no access token returned");

        // 🧠 Persist new tokens
        localStorage.setItem(TOKEN_KEY, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 🔁 Retry original request with new access token
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshErr) {
        console.warn("🔐 Token refresh failed:", refreshErr.message);
        window.dispatchEvent(new CustomEvent("forceLogout")); // Listen in your app
        return Promise.reject(new axios.Cancel("Session expired. Refresh failed."));
      }
    }

    return Promise.reject(err);
  }
);

// 🧩 Modular API Barrels — per feature domain
export { api };
export default api;

export * as auth from "./auth";
export * as cart from "./cart";
export * as products from "./products";
export * as wishlist from "./wishlist";
export * as review from "./reviews";
export * as users from "./users";
export * as upload from "./upload";
export * as health from "./health";
export * as ping from "./ping";
export * as publicApi from "./public";
export * as email from "./email";

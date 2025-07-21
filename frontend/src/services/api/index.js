import axios from "axios";

// 🌍 Dynamic Base URL
const isLocalhost = window.location.hostname === "localhost";
const baseURL = isLocalhost
  ? import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8080/api"
  : import.meta.env.VITE_API_URL || "https://adit-investment-1.onrender.com/api";

// ⚙️ Axios Instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // ⬅️ try 20 seconds for resilience
  withCredentials: true,
});



// 🛡️ Attach token to requests
api.interceptors.request.use(
  (config) => {
    if (config._suppressAuth) return config; // 👈 Add this
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// 🔁 Response Handler: Retry on 401, refresh tokens, smart recovery
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Handle canceled requests
    if (axios.isCancel(err)) {
      return Promise.reject(err);
    }
    
    const original = err.config;
    const status = err.response?.status;
    const url = original?.url || "";

    const isAuthRoute = /\/auth\/(login|register|refresh)/.test(url);
    const isPublic = /\/(products|health|ping)/.test(url);
    const isSessionRoute = /\/(cart|wishlist)/.test(url);

    // ⚡ Retry session-related 400s
    if (status === 400 && isSessionRoute && !original._retry) {
      original._retry = true;
      return new Promise((resolve) => {
        setTimeout(() => resolve(api(original)), 1000);
      });
    }

    // 🔁 Refresh on expired token
    if (status === 401 && !original._retry && !isAuthRoute && !isPublic) {
      original._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        const newAccessToken = res.data?.token || res.data?.accessToken;
        const newRefreshToken = res.data?.refreshToken;

        if (!newAccessToken) throw new Error("Missing access token");

        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshErr) {
        console.warn("🔒 Refresh failed:", refreshErr.message);
        // Dispatch global event for forced logout
        window.dispatchEvent(new CustomEvent('forceLogout'));
        // Cancel the original request
        return Promise.reject(new axios.Cancel('Request canceled - refresh failed'));
      }
    }

    return Promise.reject(err);
  }
);

// ✅ Barrel exports
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
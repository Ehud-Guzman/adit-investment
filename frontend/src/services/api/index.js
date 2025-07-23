import axios from "axios";

    import { TOKEN_KEY } from "./auth";

// 🌍 Base URL — Netlify/Render will inject in prod via env
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
console.log("🔥 API BaseURL:", baseURL); // remove this after verifying!

// ⚙️ Axios Instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,           // ⏱ 20s timeout
  withCredentials: true,    // 🍪 for cookie-based refresh
});

// 🛡️ REQUEST INTERCEPTOR — attach access token if available
api.interceptors.request.use(
  (config) => {
    if (config._suppressAuth) return config;

const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 RESPONSE INTERCEPTOR — handle token refresh logic
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const url = original?.url || "";

    const isAuthRoute = /\/auth\/(login|register|refresh)/.test(url);
    const isPublic = /\/(products|health|ping)/.test(url);

    if (axios.isCancel(err)) return Promise.reject(err);

    // 👉 If 401, attempt refresh once unless it's an auth/public route
    if (status === 401 && !original._retry && !isAuthRoute && !isPublic) {
      original._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh", null, {
          _suppressAuth: true,
        });

        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (!newAccessToken) throw new Error("No access token received");

        // ✅ Save refreshed tokens
        localStorage.setItem("adminAccessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 🔁 Retry the original request with new access token
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshErr) {
        console.warn("🔒 Refresh failed:", refreshErr.message);
        window.dispatchEvent(new CustomEvent("forceLogout")); // 🚨 Logout listener
        return Promise.reject(new axios.Cancel("Refresh failed"));
      }
    }

    return Promise.reject(err);
  }
);

// ✅ Export base instance and domain-split services
export { api };
export default api;

// Barrel export per feature domain
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

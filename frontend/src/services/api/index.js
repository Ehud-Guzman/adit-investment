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
  timeout: 20000,           // ⏱ 20s timeout
  withCredentials: true,    // 🍪 cookies for refresh token
});

// 🛡️ REQUEST INTERCEPTOR — attach access token
api.interceptors.request.use(
  (config) => {
    if (config._suppressAuth) return config;

    const token = localStorage.getItem("adminAccessToken"); // 💡 Use consistent admin key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 RESPONSE INTERCEPTOR — refresh logic
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const url = original?.url || "";

    // Ignore retry loops or irrelevant routes
    const isAuthRoute = /\/auth\/(login|register|refresh)/.test(url);
    const isPublic = /\/(products|health|ping)/.test(url);

    if (axios.isCancel(err)) return Promise.reject(err);
    if (status === 401 && !original._retry && !isAuthRoute && !isPublic) {
      original._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh", null, {
          _suppressAuth: true, // ❌ don’t attach expired token
        });

        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (!newAccessToken) throw new Error("No access token received");

        // 🔐 Save new tokens
        localStorage.setItem("adminAccessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 🧠 Retry original request with new token
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshErr) {
        console.warn("🔒 Refresh failed:", refreshErr.message);
        window.dispatchEvent(new CustomEvent("forceLogout")); // ❗ Trigger logout on failure
        return Promise.reject(new axios.Cancel("Request canceled - refresh failed"));
      }
    }

    return Promise.reject(err);
  }
);

// ✅ Barrel Exports — split by domain
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

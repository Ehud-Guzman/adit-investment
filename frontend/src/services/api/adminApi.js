// services/api/adminApi.js
import axios from "axios";
import { getAdminToken } from "@/services/api/auth/token";

const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

const baseURL = isLocalhost
  ? import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8080/api"
  : import.meta.env.VITE_API_URL || "https://adit-investment-1.onrender.com/api";

// 🛡️ Axios instance with credentials for cookie-based refresh
const adminApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // ✅ Needed for sending refreshToken cookie
});

// 🔐 Attach access token from localStorage
adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken(); // from localStorage or secure helper
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;

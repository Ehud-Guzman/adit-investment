// services/api/adminApi.js
import axios from "axios";
import { TOKEN_KEY } from "@/services/api/auth";

// 🌍 Ensure baseURL is defined
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("❌ VITE_API_URL is missing. Set it in Netlify/env vars.");

// 🛠️ Create Admin Axios instance
const adminApi = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true, // 🍪 Needed for cookie-based refresh flows
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor — Add access token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY); // Change this if you use a different key like "adminAccessToken"
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 (Optional) Response Interceptor — Token refresh logic
// You can skip this if it's handled in your main API instance

export default adminApi;

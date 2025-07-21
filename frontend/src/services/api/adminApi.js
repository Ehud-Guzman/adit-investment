// services/api/adminApi.js
import axios from "axios";
import { getAdminToken } from "@/services/api/auth/token"; // ✅ Use helper for consistency

const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

const baseURL = isLocalhost
  ? import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8080/api"
  : import.meta.env.VITE_API_URL || "https://adit-investment-1.onrender.com/api";

const adminApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // Only needed if you're doing cookie auth (you're not)
});

// ✅ Attach correct admin access token to headers
adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken(); // or localStorage.getItem("adminAccessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;

// 📊 useDashboardData.js
import { useQuery } from "@tanstack/react-query";
import axios from "@/services/api/index"; // ✅ Custom Axios instance with baseURL

// 🧠 Fetches dashboard overview metrics (for admin dashboard)
const fetchDashboardData = async () => {
  const response = await axios.get("/admin/dashboard/overview");
  return response.data;
};

/**
 * 🧩 useDashboardData
 * React Query hook to fetch and cache dashboard metrics
 */
export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-overview"], // 🔑 Cached under this key
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,         // ⏱ 5 minutes cache
    retry: 1,                         // 🔁 Retry once on failure
  });
};

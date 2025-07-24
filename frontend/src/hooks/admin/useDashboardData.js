// 📊 useDashboardData.js
import { useQuery } from "@tanstack/react-query";
import axios from "@/services/api/index"; // ✅ Centralized Axios with baseURL + interceptors

/**
 * 🚀 Fetches dashboard metrics from the admin API
 * GET /admin/dashboard/overview
 */
const fetchDashboardData = async () => {
  const { data } = await axios.get("/admin/dashboard/overview");
  return data;
};

/**
 * 🧠 useDashboardData
 * Fetches and caches admin dashboard metrics
 */
export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false, // 🚫 Don't hammer on tab switch
  });
};

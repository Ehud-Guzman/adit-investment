import { useQuery } from "@tanstack/react-query";
import axios from "@/services/api/index";

const fetchDashboardData = async () => {
  try {
    const { data } = await axios.get("/admin/dashboard/overview");
    return data;
  } catch (error) {
    // Transform error to user-friendly message
    let message = "Failed to load dashboard data";
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "Authentication required";
          break;
        case 403:
          message = "You don't have permission";
          break;
        case 500:
          message = "Server error occurred";
          break;
        default:
          message = `Request failed: ${error.response.status}`;
      }
    } else if (error.request) {
      message = "Network error - please check your connection";
    }
    
    throw new Error(message);
  }
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 2000,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 10, // Refresh every 10 minutes
    onError: (error) => {
      console.error("Dashboard data error:", error.message);
    }
  });
};
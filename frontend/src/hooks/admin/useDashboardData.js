import { useQuery } from "@tanstack/react-query";
import axios from "@/services/api"; // your Axios instance

const fetchDashboardData = async () => {
  const { data } = await axios.get("/api/admin/dashboard/overview");
  return data;
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // cache for 5 mins
    retry: 1,
  });
};

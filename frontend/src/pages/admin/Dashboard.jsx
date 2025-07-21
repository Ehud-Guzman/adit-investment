import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import api from "@/services/api/index";

import DashboardMetrics from "@/components/admin/dashboard/DashboardMetrics";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import RecentActivityFeed from "@/components/admin/dashboard/RecentActivityFeed";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const AdminDashboard = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard/overview");
      return res.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
  });

  // Combined loading state
  const loading = isLoading || isRefetching;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with refresh button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              📊 Admin Dashboard
            </span>
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of platform metrics and user activity
          </p>
        </div>
        
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader 
                key={i} 
                className="h-32 rounded-xl" 
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader className="h-96 rounded-xl" />
            <SkeletonLoader className="h-96 rounded-xl" />
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && !loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-red-100 text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <div className="bg-red-200 p-2 rounded-full">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to load dashboard data
          </h2>
          <p className="text-gray-600 max-w-md mb-4">
            {error.message || "There was an issue fetching your data. Please try again."}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Success state */}
      {!loading && !isError && data && (
        <>
          <DashboardMetrics data={data} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCharts 
              data={data} 
              className="lg:col-span-1"
            />
            
            <RecentActivityFeed 
              logs={data?.latestLogs || []} 
              className="lg:col-span-1"
            />
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !isError && !data && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <div className="bg-gray-200 p-2 rounded-full">
              <span className="text-gray-600 text-2xl">📭</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No dashboard data available
          </h2>
          <p className="text-gray-600 max-w-md mb-4">
            There's no data to display at the moment. Try refreshing or check back later.
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import api from "@/services/api/index";

import DashboardMetrics from "@/components/Admin/dashboard/DashboardMetrics";
import DashboardCharts from "@/components/Admin/dashboard/DashboardCharts";
import RecentActivityFeed from "@/components/Admin/dashboard/RecentActivityFeed";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard/overview");
      return res.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const loading = isLoading || isRefetching;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Overview of platform metrics and activity</p>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader className="h-80 rounded-xl" />
            <SkeletonLoader className="h-80 rounded-xl" />
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && !loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-100 shadow-sm text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            {error?.message || "There was an issue fetching your data. Please try again."}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Data */}
      {!loading && !isError && data && (
        <>
          <DashboardMetrics data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCharts data={data} />
            <RecentActivityFeed logs={data?.latestLogs || []} />
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !isError && !data && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <span className="text-gray-500 text-2xl">-</span>
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            No data available
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            Nothing to display yet. Try refreshing or check back later.
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

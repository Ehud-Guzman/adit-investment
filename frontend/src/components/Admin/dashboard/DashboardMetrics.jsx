import React from "react";
import PropTypes from "prop-types";
import {
  UsersIcon,
  ShieldCheckIcon,
  CubeIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const DashboardMetrics = ({ data, loading, error, onRetry }) => {
  // Metric configuration with colors and icons
  const metricsConfig = [
    {
      key: "totalUsers",
      title: "Total Users",
      icon: <UsersIcon className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      trendColor: "text-blue-500",
    },
    {
      key: "totalAdmins",
      title: "Admins",
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      color: "bg-emerald-100 text-emerald-600",
      trendColor: "text-emerald-500",
    },
    {
      key: "totalProducts",
      title: "Products",
      icon: <CubeIcon className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600",
      trendColor: "text-indigo-500",
    },
    {
      key: "totalReviews",
      title: "Reviews",
      icon: <ChatBubbleLeftIcon className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      trendColor: "text-purple-500",
    },
  ];

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Skeleton loader for metrics
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricsConfig.map((metric) => (
          <div
            key={metric.key}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className={`h-12 w-12 rounded-full ${metric.color} animate-pulse`}></div>
            </div>
            <div className="mt-4 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
        <div className="text-center">
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Failed to load metrics
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metricsConfig.map((metric) => {
        const value = data?.[metric.key] || 0;
        const trend = data?.[`${metric.key}Trend`] || 0;
        const isPositive = trend >= 0;

        return (
          <div
            key={metric.key}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {metric.title}
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNumber(value)}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${metric.color} transition-transform hover:scale-110`}
              >
                {metric.icon}
              </div>
            </div>

            {/* Trend indicator */}
            <div className="mt-4 flex items-center">
              <div
                className={`flex items-center text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trend !== 0 && `${Math.abs(trend)}%`}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {isPositive ? "from last week" : "from last week"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

DashboardMetrics.propTypes = {
  data: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalAdmins: PropTypes.number,
    totalProducts: PropTypes.number,
    totalReviews: PropTypes.number,
    totalUsersTrend: PropTypes.number,
    totalAdminsTrend: PropTypes.number,
    totalProductsTrend: PropTypes.number,
    totalReviewsTrend: PropTypes.number,
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

DashboardMetrics.defaultProps = {
  loading: false,
  onRetry: () => {},
};

export default DashboardMetrics;
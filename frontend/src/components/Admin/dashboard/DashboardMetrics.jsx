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
import { motion, AnimatePresence } from "framer-motion";

const METRICS = [
  {
    key: "totalUsers",
    title: "Total Users",
    icon: UsersIcon,
    accent: "border-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    key: "totalAdmins",
    title: "Admins",
    icon: ShieldCheckIcon,
    accent: "border-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "totalProducts",
    title: "Products",
    icon: CubeIcon,
    accent: "border-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "totalReviews",
    title: "Reviews",
    icon: ChatBubbleLeftIcon,
    accent: "border-purple-500",
    iconBg: "bg-purple-50 text-purple-600",
  },
];

const formatNumber = (num) => {
  if (!num && num !== 0) return "—";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};

const DashboardMetrics = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map(({ key, title, icon: Icon, accent, iconBg }, i) => {
        const value = data?.[key] ?? 0;
        const trend = data?.[`${key}Trend`] ?? 0;
        const isUp = trend > 0;
        const isDown = trend < 0;

        return (
          <motion.div
            key={key}
            className={`bg-white rounded-xl border border-gray-200 border-l-4 ${accent} shadow-sm p-5 hover:shadow-md transition-shadow`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1 truncate">{title}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${key}-${value}`}
                    className="text-2xl font-bold text-gray-900 tracking-tight"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {formatNumber(value)}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className={`p-2.5 rounded-lg ${iconBg} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Trend */}
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              {isUp && (
                <span className="flex items-center gap-0.5 font-semibold text-emerald-600">
                  <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                  +{trend}%
                </span>
              )}
              {isDown && (
                <span className="flex items-center gap-0.5 font-semibold text-red-500">
                  <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                  {trend}%
                </span>
              )}
              {!isUp && !isDown && (
                <span className="font-medium text-gray-400">—</span>
              )}
              <span className="text-gray-400">vs last week</span>
            </div>
          </motion.div>
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
};

export default DashboardMetrics;

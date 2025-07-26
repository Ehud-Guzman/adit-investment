import React from "react";
import PropTypes from "prop-types";
import { 
  FiClock, 
  FiUserCheck, 
  FiEdit3, 
  FiTrash2, 
  FiShield,
  FiArrowUp,
  FiArrowDown,
  FiUserPlus,
  FiRefreshCw
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from "framer-motion";

const actionIcons = {
  update_user: <FiEdit3 className="text-blue-500" />,
  promote_user: <FiArrowUp className="text-green-600" />,
  demote_user: <FiArrowDown className="text-red-500" />,
  delete_user: <FiTrash2 className="text-red-600" />,
  restore_user: <FiRefreshCw className="text-emerald-500" />,
  create_user: <FiUserPlus className="text-indigo-500" />,
};

const actionTitles = {
  update_user: "Updated user",
  promote_user: "Promoted to admin",
  demote_user: "Demoted admin",
  delete_user: "Deleted user",
  restore_user: "Restored user",
  create_user: "Created user",
};

const RecentActivityFeed = ({ logs = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔍 Recent Admin Activity</h3>
        <ul className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-start gap-3 text-sm pb-3">
              <Skeleton circle width={20} height={20} />
              <div className="flex-1">
                <Skeleton width="70%" />
                <Skeleton width="50%" />
                <Skeleton width="30%" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <div className="text-red-500 mb-2">
          <FiClock className="inline-block text-2xl" />
        </div>
        <h3 className="text-gray-800 font-medium mb-1">Failed to load activity</h3>
        <p className="text-gray-600 text-sm mb-3">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <div className="text-gray-400 mb-2">
          <FiClock className="inline-block text-2xl" />
        </div>
        <h3 className="text-gray-800 font-medium">No recent activity</h3>
        <p className="text-gray-500 text-sm">Admin actions will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🔍 Recent Admin Activity</h3>
      <ul className="space-y-3">
        {logs.map((log, i) => {
          const icon = actionIcons[log.action] || <FiClock className="text-gray-400" />;
          const title = actionTitles[log.action] || log.action;
          const timeAgo = formatDistanceToNow(new Date(log.createdAt), { addSuffix: true });
          
          return (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-sm pb-3 border-b border-gray-100 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mt-1 p-1 bg-gray-50 rounded-lg">{icon}</div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{title}</p>
                <p className="text-gray-600">
                  <span className="text-indigo-600">Admin:</span> {log.adminName || log.adminId}
                </p>
                <p className="text-gray-500 text-xs mt-1 flex items-center">
                  <FiClock className="mr-1" size={12} />
                  {timeAgo}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

RecentActivityFeed.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.string.isRequired,
      adminId: PropTypes.string.isRequired,
      adminName: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

RecentActivityFeed.defaultProps = {
  loading: false,
};

export default RecentActivityFeed;
import { FiClock, FiUserCheck, FiEdit3, FiTrash2, FiShield } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const actionIcons = {
  update_user: <FiEdit3 className="text-blue-500" />,
  promote_user: <FiShield className="text-green-600" />,
  demote_user: <FiShield className="text-red-500" />,
  delete_user: <FiTrash2 className="text-red-600" />,
  restore_user: <FiUserCheck className="text-emerald-500" />,
};

const RecentActivityFeed = ({ logs = [] }) => {
  if (!logs.length) {
    return (
      <div className="bg-white p-4 rounded shadow text-center text-gray-500">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🔍 Recent Admin Activity</h3>
      <ul className="space-y-4">
        {logs.map((log, i) => {
          const icon = actionIcons[log.action] || <FiClock className="text-gray-400" />;
          return (
            <li
              key={i}
              className="flex items-start gap-3 text-sm border-b pb-3 border-gray-100 last:border-none"
            >
              <div className="mt-1">{icon}</div>
              <div className="flex-1">
                <p className="text-gray-700">
                  <span className="font-medium text-indigo-600">Admin:</span>{" "}
                  <span className="text-gray-900">{log.adminId}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Action:</span> {log.action}
                </p>
                <p className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentActivityFeed;

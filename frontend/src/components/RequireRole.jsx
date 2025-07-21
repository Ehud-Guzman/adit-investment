// components/RequireRole.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth"; // Your admin auth hook

const RequireRole = ({ children, allowedRoles = [] }) => {
  const { admin, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin" state={{ from: location }} replace />
    );
  }

  const hasAccess = allowedRoles.includes(admin?.role);

  if (!hasAccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-3xl font-bold text-red-600">🚫 Access Denied</h2>
          <p className="text-zinc-500 mt-2">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireRole;

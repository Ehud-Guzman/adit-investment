// src/components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { currentUser, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return <div className="text-center py-10">Loading user...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;

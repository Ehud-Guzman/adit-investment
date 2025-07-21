import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

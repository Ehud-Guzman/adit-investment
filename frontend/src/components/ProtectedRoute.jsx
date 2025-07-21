// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingSpinner fullPage />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};
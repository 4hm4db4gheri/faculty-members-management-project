import { Navigate } from "react-router-dom";
import { AuthService } from "../Services/AuthService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireFullAccess?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireFullAccess = false,
}) => {
  const isAuthenticated = AuthService.isAuthenticated(); // Checks if accessToken exists in localStorage
  const hasFullAccess = AuthService.hasFullAccess(); // Checks if decoded token has 'FullAccess'

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page (/)
    return <Navigate to="/" replace />;
  }

  if (requireFullAccess && !hasFullAccess) {
    // If full access is required but user doesn't have it, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>; // If checks pass, render the children (DashboardComponent)
};

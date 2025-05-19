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
  const isAuthenticated = AuthService.isAuthenticated();
  const hasFullAccess = AuthService.hasFullAccess();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireFullAccess && !hasFullAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

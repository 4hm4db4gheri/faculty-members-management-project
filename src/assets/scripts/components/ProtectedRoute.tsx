import { Navigate } from "react-router-dom";
import { AuthService } from "../Services/AuthService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

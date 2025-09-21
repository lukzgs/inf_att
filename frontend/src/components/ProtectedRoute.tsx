import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // AuthHandler is responsible for redirection.
    // Return null to prevent rendering children and avoid a flash of content.
    return null;
  }

  // If roles are required, check if the user has at least one of them
  if (roles && roles.length > 0) {
    const hasRequiredRole = user?.roles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      // Redirect to a "not authorized" page or home
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
}

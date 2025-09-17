import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

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

  return <>{children}</>;
}

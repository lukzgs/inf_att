import { Navigate, Outlet } from 'react-router-dom';

// Placeholder: Auth logic will be added later
const useAuth = () => {
  // For now, we'll assume the user is authenticated.
  // This will be replaced with actual logic from AuthContext.
  return { isAuthenticated: true };
};

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // The Outlet renders the child routes defined within this protected route.
  return <Outlet />;
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * This component handles navigation side-effects based on authentication state changes.
 * It must be rendered within a Router context.
 */
export const AuthHandler = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect until the initial loading is done
    if (isLoading) {
      return;
    }

    // If we have a user, it means login was successful, redirect to dashboard
    if (user) {
        // Check if we are on the login page and redirect away
        if (window.location.pathname === '/login') {
            navigate('/dashboard');
        }
    } else {
        // If there's no user and we are not on the login page, redirect to login
        // This handles logout and expired tokens
        if (window.location.pathname !== '/login') {
            navigate('/login');
        }
    }
  }, [user, isLoading, navigate]);

  // This component does not render anything
  return null;
};

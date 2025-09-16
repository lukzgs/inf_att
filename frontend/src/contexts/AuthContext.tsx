import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { api } from '../services/api';

// Define the shape of the user object and the context
interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  useEffect(() => {
    // If a token exists, fetch user data
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // This assumes you have a /auth/profile endpoint to get user data
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // If token is invalid, logout
          logout();
        });
    }
  }, [token]);

  async function login(receivedToken: string) {
    localStorage.setItem('authToken', receivedToken);
    setToken(receivedToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    // Fetch user profile after login
    const response = await api.get('/auth/profile');
    setUser(response.data);
  }

  function logout() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

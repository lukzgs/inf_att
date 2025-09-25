import { createContext, useState, useEffect, useContext, type ReactNode, useCallback, useMemo } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get<User>('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch profile with stored token:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = useCallback(async (receivedToken: string) => {
    localStorage.setItem('authToken', receivedToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    try {
      const response = await api.get<User>('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile after login", error);
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  const authContextValue = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    isLoading,
    login,
    logout,
  }), [user, isLoading, login]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

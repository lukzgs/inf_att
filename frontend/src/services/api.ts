import axios from 'axios';
import { toast } from 'sonner';

// The backend URL will be read from environment variables
// For Docker development, use http://localhost:3000
// For production, use the production API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variable to track if we've already shown the session expired message
let sessionExpiredShown = false;

// Interceptor to handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it and redirect to login
      const wasAuthenticated = !!localStorage.getItem('authToken');
      localStorage.removeItem('authToken');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // Show toast to user before redirecting (only once)
        if (!sessionExpiredShown && wasAuthenticated) {
          sessionExpiredShown = true;
          
          toast.error('Sessão Expirada', {
            description: 'Sua sessão expirou. Você será redirecionado para a página de login.',
            duration: 3000,
          });
          
          // Redirect after showing the toast
          setTimeout(() => {
            sessionExpiredShown = false;
            window.location.href = '/login';
          }, 3000);
        } else if (!wasAuthenticated) {
          // If there was no token, redirect immediately
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

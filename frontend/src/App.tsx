import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthHandler } from './contexts/AuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesListPage from './pages/CoursesListPage';
import CourseFormPage from './pages/CourseFormPage';
import CoursePage from './pages/CoursePage';
import './App.css';

/**
 * Handles the root path, redirecting based on auth state or showing a loading indicator.
 */
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Navigate to the appropriate page once loading is complete
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthHandler />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="courses" element={<CoursesListPage />} />
            <Route path="courses/new" element={<CourseFormPage />} />
            <Route path="courses/:id" element={<CoursePage />} />
          </Route>

          {/* Root redirect handles the "/" path */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesListPage from './pages/CoursesListPage';
import CoursePage from './pages/CoursePage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesListPage />} />
          <Route path="/courses/:id" element={<CoursePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

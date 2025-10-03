import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthHandler } from './contexts/AuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesListPage from './pages/CoursesListPage';
import CourseFormPage from './pages/CourseFormPage';
import CoursePage from './pages/CoursePage';
import UsuariosListPage from './pages/admin/usuarios/UsuariosListPage';
import UsuarioFormPage from './pages/admin/usuarios/UsuarioFormPage';
import DisciplinasListPage from './pages/admin/disciplinas/DisciplinasListPage';
import DisciplinaFormPage from './pages/admin/disciplinas/DisciplinaFormPage';
import TurmasListPage from './pages/admin/turmas/TurmasListPage';
import TurmaFormPage from './pages/admin/turmas/TurmaFormPage';
import AulasListPage from './pages/admin/aulas/AulasListPage';
import AulaFormPage from './pages/admin/aulas/AulaFormPage';
import PresencasListPage from './pages/admin/presencas/PresencasListPage';
import PresencaFormPage from './pages/admin/presencas/PresencaFormPage';
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
        <Toaster 
          position="bottom-center" 
          richColors 
          closeButton
          expand={true}
          toastOptions={{
            className: 'toast-custom',
            style: {
              minWidth: '320px',
              maxWidth: '500px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route 
            element={
              <ProtectedRoute roles={['ADMIN', 'PROFESSOR', 'USER', 'STUDENT']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="courses" element={<CoursesListPage />} />
            <Route path="courses/new" element={<CourseFormPage />} />
            <Route path="courses/:id" element={<CoursePage />} />
            
            {/* Admin Routes - Usuários */}
            <Route path="admin/usuarios" element={<UsuariosListPage />} />
            <Route path="admin/usuarios/novo" element={<UsuarioFormPage />} />
            <Route path="admin/usuarios/:id/editar" element={<UsuarioFormPage />} />
            
            {/* Admin Routes - Disciplinas */}
            <Route path="admin/disciplinas" element={<DisciplinasListPage />} />
            <Route path="admin/disciplinas/novo" element={<DisciplinaFormPage />} />
            <Route path="admin/disciplinas/:id/editar" element={<DisciplinaFormPage />} />
            
            {/* Admin Routes - Turmas */}
            <Route path="admin/turmas" element={<TurmasListPage />} />
            <Route path="admin/turmas/novo" element={<TurmaFormPage />} />
            <Route path="admin/turmas/:id/editar" element={<TurmaFormPage />} />
            
            {/* Admin Routes - Aulas */}
            <Route path="admin/aulas" element={<AulasListPage />} />
            <Route path="admin/aulas/novo" element={<AulaFormPage />} />
            <Route path="admin/aulas/:id/editar" element={<AulaFormPage />} />
            
            {/* Admin Routes - Presencas */}
            <Route path="admin/presencas" element={<PresencasListPage />} />
            <Route path="admin/presencas/novo" element={<PresencaFormPage />} />
            <Route path="admin/presencas/:lessonId/:userId/editar" element={<PresencaFormPage />} />
          </Route>

          {/* Root redirect handles the "/" path */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

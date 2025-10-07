import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthHandler } from './contexts/AuthHandler';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import { LoadingPage } from './components/shared/LoadingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Core pages (always loaded - small and essential)
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage'; // ✅ Dashboard carregado imediatamente

// Professor pages (carregadas imediatamente para melhor performance)
import ClassDetailPage from './features/professor/classes/ClassDetailPage';

// Lazy-loaded pages (loaded on demand)
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const CoursesListPage = lazy(() => import('./pages/CoursesListPage'));
const CourseFormPage = lazy(() => import('./pages/CourseFormPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));

// Student pages
const SubjectDetailPage = lazy(() => import('./features/student/subjects/SubjectDetailPage'));

// Admin - Usuários
const UsuariosListPage = lazy(() => import('./pages/admin/usuarios/UsuariosListPage'));
const UsuarioFormPage = lazy(() => import('./pages/admin/usuarios/UsuarioFormPage'));

// Admin - Disciplinas
const DisciplinasListPage = lazy(() => import('./pages/admin/disciplinas/DisciplinasListPage'));
const DisciplinaFormPage = lazy(() => import('./pages/admin/disciplinas/DisciplinaFormPage'));

// Admin - Turmas
const TurmasListPage = lazy(() => import('./pages/admin/turmas/TurmasListPage'));
const TurmaFormPage = lazy(() => import('./pages/admin/turmas/TurmaFormPage'));
const ClassFormWizard = lazy(() => import('./components/wizard/ClassFormWizard').then(m => ({ default: m.ClassFormWizard })));

// Admin - Aulas
const AulasListPage = lazy(() => import('./pages/admin/aulas/AulasListPage'));
const AulaFormPage = lazy(() => import('./pages/admin/aulas/AulaFormPage'));

// Admin - Presenças
const PresencasListPage = lazy(() => import('./pages/admin/presencas/PresencasListPage'));
const PresencaFormPage = lazy(() => import('./pages/admin/presencas/PresencaFormPage'));

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
    <ErrorBoundary>
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
            <Route path="profile" element={
              <Suspense fallback={<LoadingPage />}>
                <ProfilePage />
              </Suspense>
            } />
            <Route path="statistics" element={
              <Suspense fallback={<LoadingPage />}>
                <StatisticsPage />
              </Suspense>
            } />
            <Route path="courses" element={
              <Suspense fallback={<LoadingPage />}>
                <CoursesListPage />
              </Suspense>
            } />
            <Route path="courses/new" element={
              <Suspense fallback={<LoadingPage />}>
                <CourseFormPage />
              </Suspense>
            } />
            <Route path="courses/:id" element={
              <Suspense fallback={<LoadingPage />}>
                <CoursePage />
              </Suspense>
            } />
            
            {/* Student Routes */}
            <Route path="student/subjects/:id" element={
              <Suspense fallback={<LoadingPage />}>
                <SubjectDetailPage />
              </Suspense>
            } />
            
            {/* Professor Routes - Sem Suspense para carregamento mais rápido */}
            <Route path="professor/turmas/:id" element={<ClassDetailPage />} />
            
            {/* Admin Routes - Usuários */}
            <Route path="admin/usuarios" element={
              <Suspense fallback={<LoadingPage />}>
                <UsuariosListPage />
              </Suspense>
            } />
            <Route path="admin/usuarios/novo" element={
              <Suspense fallback={<LoadingPage />}>
                <UsuarioFormPage />
              </Suspense>
            } />
            <Route path="admin/usuarios/:id/editar" element={
              <Suspense fallback={<LoadingPage />}>
                <UsuarioFormPage />
              </Suspense>
            } />
            
            {/* Admin Routes - Disciplinas */}
            <Route path="admin/disciplinas" element={
              <Suspense fallback={<LoadingPage />}>
                <DisciplinasListPage />
              </Suspense>
            } />
            <Route path="admin/disciplinas/novo" element={
              <Suspense fallback={<LoadingPage />}>
                <DisciplinaFormPage />
              </Suspense>
            } />
            <Route path="admin/disciplinas/:id/editar" element={
              <Suspense fallback={<LoadingPage />}>
                <DisciplinaFormPage />
              </Suspense>
            } />
            
            {/* Admin Routes - Turmas */}
            <Route path="admin/turmas" element={
              <Suspense fallback={<LoadingPage />}>
                <TurmasListPage />
              </Suspense>
            } />
            <Route path="admin/turmas/novo" element={
              <Suspense fallback={<LoadingPage />}>
                <TurmaFormPage />
              </Suspense>
            } />
            <Route path="admin/turmas/wizard" element={
              <Suspense fallback={<LoadingPage />}>
                <ClassFormWizard />
              </Suspense>
            } />
            <Route path="admin/turmas/:id/editar" element={
              <Suspense fallback={<LoadingPage />}>
                <TurmaFormPage />
              </Suspense>
            } />
            
            {/* Admin Routes - Aulas */}
            <Route path="admin/aulas" element={
              <Suspense fallback={<LoadingPage />}>
                <AulasListPage />
              </Suspense>
            } />
            <Route path="admin/aulas/novo" element={
              <Suspense fallback={<LoadingPage />}>
                <AulaFormPage />
              </Suspense>
            } />
            <Route path="admin/aulas/:id/editar" element={
              <Suspense fallback={<LoadingPage />}>
                <AulaFormPage />
              </Suspense>
            } />
            
            {/* Admin Routes - Presencas */}
            <Route path="admin/presencas" element={
              <Suspense fallback={<LoadingPage />}>
                <PresencasListPage />
              </Suspense>
            } />
            <Route path="admin/presencas/novo" element={
              <Suspense fallback={<LoadingPage />}>
                <PresencaFormPage />
              </Suspense>
            } />
            <Route path="admin/presencas/:lessonId/:userId/editar" element={
              <Suspense fallback={<LoadingPage />}>
                <PresencaFormPage />
              </Suspense>
            } />
          </Route>

          {/* Root redirect handles the "/" path */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;

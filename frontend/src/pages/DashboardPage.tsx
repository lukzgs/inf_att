import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Lazy load dashboards específicos por role
const AdminDashboard = lazy(() => import('../components/dashboard/AdminDashboard'));
const ProfessorDashboard = lazy(() => import('../components/dashboard/ProfessorDashboard'));
const StudentDashboard = lazy(() => import('../features/student/dashboard/StudentDashboard'));

export default function DashboardPage() {
  const { user } = useAuth();

  // Função para determinar qual dashboard renderizar
  const renderDashboard = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <StudentDashboard />
        </Suspense>
      );
    }

    // Prioridade: ADMIN > PROFESSOR > STUDENT
    if (user.roles.includes('ADMIN')) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <AdminDashboard />
        </Suspense>
      );
    }

    if (user.roles.includes('PROFESSOR')) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <ProfessorDashboard />
        </Suspense>
      );
    }

    // Default: Student Dashboard
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <StudentDashboard />
      </Suspense>
    );
  };

  return renderDashboard();
}

// Skeleton simples para o dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-base-300 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-base-300 rounded-lg"></div>
        <div className="h-24 bg-base-300 rounded-lg"></div>
        <div className="h-24 bg-base-300 rounded-lg"></div>
      </div>
    </div>
  );
}

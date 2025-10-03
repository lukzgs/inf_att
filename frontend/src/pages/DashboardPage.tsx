import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ProfessorDashboard from '../components/dashboard/ProfessorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  // Função para determinar qual dashboard renderizar
  const renderDashboard = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return <StudentDashboard />; // Default para estudante
    }

    // Prioridade: ADMIN > PROFESSOR > STUDENT
    if (user.roles.includes('ADMIN')) {
      return <AdminDashboard />;
    }

    if (user.roles.includes('PROFESSOR')) {
      return <ProfessorDashboard />;
    }

    // Default: Student Dashboard
    return <StudentDashboard />;
  };

  return renderDashboard();
}

import StatCard from '../components/common/StatCard';
import { FiBookOpen, FiUsers, FiCheckSquare } from 'react-icons/fi';

export default function DashboardPage() {
  // Estes dados seriam carregados de sua API no futuro
  const stats = {
    activeCourses: 5,
    totalStudents: 128,
    attendanceRate: '92%',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Visão Geral</h2>
        {/* Grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={FiBookOpen} 
            label="Cursos Ativos" 
            value={stats.activeCourses}
            colorClass="bg-primary text-primary-content"
          />
          <StatCard 
            icon={FiUsers} 
            label="Alunos Matriculados" 
            value={stats.totalStudents}
            colorClass="bg-secondary text-secondary-content"
          />
          <StatCard 
            icon={FiCheckSquare} 
            label="Taxa de Presença" 
            value={stats.attendanceRate}
            colorClass="bg-accent text-accent-content"
          />
        </div>
      </div>

      {/* Aqui você pode adicionar mais seções, como "Próximas Aulas" ou "Atividade Recente" */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Atividade Recente</h2>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <p>Nenhuma atividade recente para mostrar.</p>
            {/* No futuro, aqui poderia ter uma lista de últimas chamadas realizadas, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
}

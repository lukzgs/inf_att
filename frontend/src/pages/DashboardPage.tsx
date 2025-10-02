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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Visão Geral</h2>
        {/* Grid responsivo: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Seção de Atividade Recente */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Atividade Recente</h2>
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-5xl sm:text-6xl mb-4">📊</div>
              <p className="text-base-content/70">Nenhuma atividade recente para mostrar.</p>
              <p className="text-sm text-base-content/50 mt-2">
                As próximas atividades aparecerão aqui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FiBook, FiCalendar, FiCheckCircle, FiClock, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentClasses, useStudentOverallStats } from '@/hooks/useStudentClasses';
import { FrequencyBadge } from '@/components/ui/FrequencyBadge';
import { PresenceRegistrationModal } from '../attendance/PresenceRegistrationModal';
import { formatPercentage } from '@/utils/format/formatPercentage';
import { formatNameToDisplay } from '@/utils/format/formatName';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: classes, isLoading } = useStudentClasses();
  const { totalClasses, overallPercentage } = useStudentOverallStats();
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="premium-card-wrapper">
          <div className="premium-card">
            <div className="premium-card-body">
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="premium-card-wrapper">
        <div className="gradient-glow"></div>
        <div className="premium-card">
          <div className="premium-card-body !py-6 sm:!py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <FiBook className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Olá, {user?.name ? formatNameToDisplay(user.name) : 'Aluno'}! 👋
                  </h1>
                  <p className="text-base text-gray-600 dark:text-base-content/70 mt-1">
                    Acompanhe suas disciplinas e frequência
                  </p>
                </div>
              </div>
              
              <button 
                className="btn btn-primary gap-2"
                onClick={() => setIsPresenceModalOpen(true)}
              >
                <FiPlus className="w-5 h-5" />
                Registrar Presença
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiBook />
              </div>
              <div className="stat-card-value">{totalClasses}</div>
            </div>
            <div className="stat-card-label">Disciplinas Cursadas</div>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiCheckCircle />
              </div>
              <div className="stat-card-value">{formatPercentage(overallPercentage)}</div>
            </div>
            <div className="stat-card-label">Frequência Geral</div>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiClock />
              </div>
              <div className="stat-card-value">
                {classes?.filter(c => c.frequencyStatus === 'warning' || c.frequencyStatus === 'error').length || 0}
              </div>
            </div>
            <div className="stat-card-label">Disciplinas com Atenção</div>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Minhas Disciplinas
          </h2>
          <span className="text-sm text-gray-600 dark:text-base-content/70">
            {classes?.length || 0} disciplinas
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {classes && classes.length > 0 ? (
            classes.map((cls) => (
              <div key={cls.id} className="premium-card-wrapper">
                <div className="premium-card">
                  <div className="premium-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {cls.subject?.name || 'Disciplina'}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                          {cls.subject?.code || cls.code} · Turma {cls.code}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-base-content/70">
                          {cls.totalLessons} aula{cls.totalLessons !== 1 ? 's' : ''} realizadas
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <FiBook className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-base-300">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-base-content/70 flex items-center gap-2">
                          <FiCheckCircle className="w-4 h-4" />
                          Presenças
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {cls.totalPresent} / {cls.totalLessons}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-base-content/70">
                          Frequência
                        </span>
                        <FrequencyBadge percentage={cls.attendancePercentage} size="sm" />
                      </div>

                      {/* Status indicator */}
                      {cls.frequencyStatus === 'error' && (
                        <div className="alert alert-error py-2 mt-2">
                          <span className="text-xs">⚠️ Atenção: Frequência crítica!</span>
                        </div>
                      )}
                      {cls.frequencyStatus === 'warning' && (
                        <div className="alert alert-warning py-2 mt-2">
                          <span className="text-xs">⚠️ Cuidado: Frequência baixa</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/student/subjects/${cls.id}`}
                      className="btn btn-primary btn-block mt-4"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full premium-card-wrapper">
              <div className="gradient-glow opacity-20"></div>
              <div className="premium-card">
                <div className="premium-card-body">
                  <div className="empty-state-content">
                    <div className="empty-state-icon">📚</div>
                    <h3 className="empty-state-title">Nenhuma disciplina matriculada</h3>
                    <p className="empty-state-description">
                      Você ainda não está matriculado em nenhuma disciplina
                    </p>
                    <Link to="/subjects" className="btn btn-primary mt-4">
                      Ver Disciplinas Disponíveis
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/student/attendance" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Minha Frequência</h3>
                <p className="action-card-description">
                  Veja seu histórico completo
                </p>
              </div>
            </div>
          </Link>

          <Link to="/student/schedule" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Calendário</h3>
                <p className="action-card-description">
                  Veja suas próximas aulas
                </p>
              </div>
            </div>
          </Link>

          <button 
            className="action-card text-left"
            onClick={() => setIsPresenceModalOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Registrar Presença</h3>
                <p className="action-card-description">
                  Digite o código da aula
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal de Registro de Presença */}
      <PresenceRegistrationModal
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
      />
    </div>
  );
}

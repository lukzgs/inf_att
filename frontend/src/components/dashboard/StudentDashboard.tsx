import { FiBook, FiCalendar, FiCheckCircle, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  // Dados mockados - substituir por chamadas à API
  const stats = {
    enrolledCourses: 6,
    attendanceRate: '94%',
    upcomingClasses: 4,
    completedCredits: 180,
  };

  const myClasses = [
    {
      id: 1,
      course: 'Estrutura de Dados',
      code: 'INF01121',
      classCode: 'A',
      professor: 'Prof. João Silva',
      nextClass: 'Seg, 10:30',
      attendance: '92%',
    },
    {
      id: 2,
      course: 'Banco de Dados I',
      code: 'INF01145',
      classCode: 'B',
      professor: 'Profa. Maria Santos',
      nextClass: 'Ter, 14:00',
      attendance: '88%',
    },
    {
      id: 3,
      course: 'Programação Orientada a Objetos',
      code: 'INF01120',
      classCode: 'C',
      professor: 'Prof. Carlos Souza',
      nextClass: 'Qua, 08:00',
      attendance: '95%',
    },
  ];  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="premium-card-wrapper">
        <div className="gradient-glow"></div>
        <div className="premium-card">
          <div className="premium-card-body !py-6 sm:!py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Painel do Aluno
                </h1>
                <p className="text-base text-gray-600 dark:text-base-content/70 mt-1">
                  Acompanhe suas disciplinas e frequência
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiBook />
              </div>
              <div className="stat-card-value">{stats.enrolledCourses}</div>
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
              <div className="stat-card-value">{stats.attendanceRate}</div>
            </div>
            <div className="stat-card-label">Taxa de Presença</div>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiClock />
              </div>
              <div className="stat-card-value">{stats.upcomingClasses}</div>
            </div>
            <div className="stat-card-label">Aulas Esta Semana</div>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-card-premium-inner">
            <div className="flex items-center gap-4 mb-3">
              <div className="stat-card-icon">
                <FiAward />
              </div>
              <div className="stat-card-value">{stats.completedCredits}</div>
            </div>
            <div className="stat-card-label">Créditos Cursados</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/my-classes" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Minhas Turmas</h3>
                <p className="action-card-description">
                  Visualize suas turmas e horários
                </p>
              </div>
            </div>
          </Link>

          <Link to="/my-attendance" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Minha Frequência</h3>
                <p className="action-card-description">
                  Acompanhe sua frequência detalhada
                </p>
              </div>
            </div>
          </Link>

          <Link to="/schedule" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Horários</h3>
                <p className="action-card-description">
                  Veja seu calendário de aulas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* My Classes */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Minhas Disciplinas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {myClasses.length > 0 ? (
            myClasses.map((cls) => (
              <div key={cls.id} className="premium-card-wrapper">
                <div className="premium-card">
                  <div className="premium-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {cls.course}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                          {cls.code} · Turma {cls.classCode}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-base-content/70">
                          {cls.professor}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <FiBook className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-base-300">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-base-content/70 flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          Próxima aula
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {cls.nextClass}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-base-content/70 flex items-center gap-2">
                          <FiCheckCircle className="w-4 h-4" />
                          Frequência
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {cls.attendance}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/classes/${cls.id}`}
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

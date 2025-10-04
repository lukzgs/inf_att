import { 
  FiCalendar, 
  FiClock, 
  FiCheckSquare, 
  FiUsers,
  FiPlay,
  FiSquare,
  FiBookOpen
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useProfessorClasses, useProfessorOverallStats } from '../../hooks/useProfessorClasses';
import { useLessons } from '../../hooks/useLessons';
import { useAttendances } from '../../hooks/useAttendances';

export default function ProfessorDashboard() {
  // Fetch professor's classes with stats
  const { data: professorClasses, isLoading: loadingClasses } = useProfessorClasses();
  const { data: allLessons, isLoading: loadingLessons } = useLessons();
  const { data: allAttendances, isLoading: loadingAttendances } = useAttendances();
  const overallStats = useProfessorOverallStats();

  // Get IDs of professor's classes
  const professorClassIds = professorClasses?.map((c) => c.id) || [];

  // Filter professor's lessons
  const professorLessons = allLessons?.filter((lesson) => 
    professorClassIds.includes(lesson.classId)
  ) || [];

  // Today's lessons
  const today = new Date().toISOString().split('T')[0];
  const todayLessons = professorLessons.filter((lesson) => 
    lesson.date.startsWith(today)
  );

  // Next 7 days lessons
  const next7Days = new Date();
  next7Days.setDate(next7Days.getDate() + 7);
  const upcomingLessons = professorLessons.filter((lesson) => {
    const lessonDate = new Date(lesson.date);
    return lessonDate > new Date() && lessonDate <= next7Days;
  });

  // Today's attendances
  const todayLessonIds = todayLessons.map((l) => l.id);
  const todayAttendances = allAttendances?.filter((att) => 
    todayLessonIds.includes(att.lessonId)
  ) || [];

  // Stats
  const stats = {
    totalClasses: overallStats.totalClasses,
    todayLessons: todayLessons.length,
    openLessons: overallStats.openLessons,
    todayAttendances: todayAttendances.length,
  };

  const isLoading = loadingClasses || loadingLessons || loadingAttendances;

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Hero Header */}
      <div className="hero-card">
        <div className="hero-card-overlay" />
        <div className="hero-card-content">
          <div className="hero-card-icon">
            <FiUsers />
          </div>
          <h1 className="hero-card-title">
            Painel do Professor
          </h1>
          <p className="hero-card-subtitle">
            Gerencie suas turmas, aulas e presenças
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Visão Geral
            </h2>
            <p className="section-subtitle">
              Estatísticas das suas atividades
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Classes */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiCalendar />
                </div>
                <div>
                  <div className="stat-card-value">{stats.totalClasses}</div>
                  <div className="stat-card-label">Minhas Turmas</div>
                </div>
              </div>
            )}
          </div>

          {/* Today Lessons */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiClock />
                </div>
                <div>
                  <div className="stat-card-value">{stats.todayLessons}</div>
                  <div className="stat-card-label">Aulas Hoje</div>
                </div>
              </div>
            )}
          </div>

          {/* Open Lessons */}
          <div className="stat-card-premium stat-card-success">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiPlay />
                </div>
                <div>
                  <div className="stat-card-value">{stats.openLessons}</div>
                  <div className="stat-card-label">Aulas Abertas</div>
                </div>
              </div>
            )}
          </div>

          {/* Today Attendances */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiCheckSquare />
                </div>
                <div>
                  <div className="stat-card-value">{stats.todayAttendances}</div>
                  <div className="stat-card-label">Presenças Hoje</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Today's Lessons */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Aulas de Hoje
            </h2>
            <p className="section-subtitle">
              {todayLessons.length} aula(s) programada(s) para hoje
            </p>
          </div>
        </div>
        
        <div className="list-card">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-premium h-20 w-full" />
              ))}
            </div>
          ) : todayLessons.length > 0 ? (
            <div>
              {todayLessons.map((lesson) => (
                <div key={lesson.id} className="list-card-item">
                  <div className="list-card-item-icon">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                      lesson.isOpen 
                        ? 'bg-success' 
                        : 'bg-primary'
                    }`}>
                      {lesson.isOpen ? (
                        <FiPlay className="w-6 h-6 text-white" />
                      ) : (
                        <FiClock className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {lesson.class?.code || 'Sem código'} - {lesson.class?.subject?.name || 'Sem disciplina'}
                      </p>
                      {lesson.isOpen && (
                        <span className="badge-premium badge-premium-success flex-shrink-0">
                          <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-1" />
                          Aberta
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-base-content/70">
                      {lesson.startTime.substring(0, 5)} - {lesson.endTime.substring(0, 5)}
                      {lesson.openedAt && (
                        <span className="ml-2">
                          • Aberta às {new Date(lesson.openedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {lesson.isOpen ? (
                      <button className="btn-premium-outline !px-4 !py-2 text-sm bg-error/10 border-error text-error hover:bg-error hover:text-white">
                        <FiSquare className="w-4 h-4" />
                        Fechar
                      </button>
                    ) : (
                      <button className="btn-premium !px-4 !py-2 text-sm">
                        <FiPlay className="w-4 h-4" />
                        Abrir
                      </button>
                    )}
                    <Link 
                      to={`/professor/aulas/${lesson.id}`}
                      className="btn-premium-outline !px-4 !py-2 text-sm"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="empty-state-title">Nenhuma aula hoje</h3>
              <p className="empty-state-description">
                Você não tem aulas programadas para hoje. Aproveite para descansar ou preparar material!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Lessons (Next 7 Days) */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Próximas Aulas
            </h2>
            <p className="section-subtitle">
              Aulas programadas para os próximos 7 dias
            </p>
          </div>
          <Link to="/professor/aulas" className="btn btn-primary btn-sm">
            Ver todas
          </Link>
        </div>
        
        <div className="list-card">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-premium h-16 w-full" />
              ))}
            </div>
          ) : upcomingLessons.length > 0 ? (
            <div>
              {upcomingLessons.slice(0, 5).map((lesson) => {
                const lessonDate = new Date(lesson.date);
                const isToday = lessonDate.toISOString().split('T')[0] === today;
                
                return (
                  <div key={lesson.id} className="list-card-item">
                    <div className="list-card-item-icon">
                      <div className="w-full h-full rounded-xl flex items-center justify-center bg-info">
                        <FiCalendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {lesson.class?.code || 'Sem código'} - {lesson.class?.subject?.name || 'Sem disciplina'}
                        </p>
                        {isToday && (
                          <span className="badge-premium badge-premium-warning flex-shrink-0">
                            Hoje
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-base-content/70">
                        {lessonDate.toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'short' 
                        })} • {lesson.startTime.substring(0, 5)} - {lesson.endTime.substring(0, 5)}
                      </p>
                    </div>
                    <Link 
                      to={`/professor/aulas/${lesson.id}`}
                      className="btn-premium-outline !px-4 !py-2 text-sm flex-shrink-0"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📆</div>
              <h3 className="empty-state-title">Nenhuma aula próxima</h3>
              <p className="empty-state-description">
                Não há aulas programadas para os próximos 7 dias
              </p>
            </div>
          )}
        </div>
      </section>

      {/* My Classes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Minhas Turmas
            </h2>
            <p className="section-subtitle">
              {professorClasses?.length || 0} turma(s) ativa(s)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-premium h-48 w-full" />
              ))}
            </>
          ) : professorClasses && professorClasses.length > 0 ? (
            professorClasses.map((classItem) => {
              
              return (
                <Link 
                  key={classItem.id} 
                  to={`/professor/turmas/${classItem.id}`}
                  className="premium-card group"
                >
                  <div className="premium-card-glow" />
                  <div className="premium-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary shadow-lg group-hover:scale-110 transition-transform">
                        <FiBookOpen className="w-7 h-7 text-white" />
                      </div>
                      <span className="badge-premium badge-premium-info">
                        {classItem.year}/{classItem.semester}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {classItem.code}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-base-content/70 mb-4 line-clamp-2">
                      {classItem.subject?.name || 'Sem disciplina'}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-base-300">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-base-content/80">
                          {classItem.totalStudents} alunos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-base-content/80">
                          {classItem.totalLessons} aulas
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="empty-state">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="empty-state-title">Nenhuma turma</h3>
                <p className="empty-state-description">
                  Você ainda não está vinculado a nenhuma turma. Entre em contato com a administração.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

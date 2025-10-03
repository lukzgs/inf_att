import { 
  FiUsers, 
  FiBookOpen, 
  FiCalendar, 
  FiActivity, 
  FiUserPlus, 
  FiSettings, 
  FiClock, 
  FiCheckSquare
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { useSubjects } from '../../hooks/useSubjects';
import { useClasses } from '../../hooks/useClasses';
import { useLessons } from '../../hooks/useLessons';
import { useAttendances } from '../../hooks/useAttendances';

export default function AdminDashboard() {
  // Buscar dados reais da API
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const { data: classes, isLoading: loadingClasses } = useClasses();
  const { data: lessons, isLoading: loadingLessons } = useLessons();
  const { data: attendances, isLoading: loadingAttendances } = useAttendances();

  // Calcular estatísticas
  const today = new Date().toISOString().split('T')[0];
  const todayLessons = lessons?.filter(lesson => lesson.date.startsWith(today)) || [];
  const todayAttendances = attendances?.filter(att => 
    todayLessons.some(lesson => lesson.id === att.lessonId)
  ) || [];
  
  const stats = {
    totalUsers: users?.length || 0,
    totalSubjects: subjects?.length || 0,
    activeClasses: classes?.length || 0,
    todayLessons: todayLessons.length,
    todayAttendances: todayAttendances.length,
  };

  const isLoading = loadingUsers || loadingSubjects || loadingClasses || loadingLessons || loadingAttendances;

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Hero Header */}
      <div className="hero-card">
        <div className="hero-card-overlay" />
        <div className="hero-card-content">
          <div className="hero-card-icon">
            <FiActivity />
          </div>
          <h1 className="hero-card-title">
            Painel Administrativo
          </h1>
          <p className="hero-card-subtitle">
            Visão geral do sistema e estatísticas em tempo real
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Estatísticas Gerais
            </h2>
            <p className="section-subtitle">
              Dados atualizados do sistema
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Total Users */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiUsers />
                </div>
                <div>
                  <div className="stat-card-value">{stats.totalUsers}</div>
                  <div className="stat-card-label">Usuários</div>
                </div>
              </div>
            )}
          </div>

          {/* Total Subjects */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiBookOpen />
                </div>
                <div>
                  <div className="stat-card-value">{stats.totalSubjects}</div>
                  <div className="stat-card-label">Disciplinas</div>
                </div>
              </div>
            )}
          </div>

          {/* Active Classes */}
          <div className="stat-card-premium">
            {isLoading ? (
              <div className="skeleton-premium h-32 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="stat-card-icon">
                  <FiCalendar />
                </div>
                <div>
                  <div className="stat-card-value">{stats.activeClasses}</div>
                  <div className="stat-card-label">Turmas Ativas</div>
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

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Ações Rápidas
            </h2>
            <p className="section-subtitle">
              Acesso rápido às principais funcionalidades
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/admin/usuarios" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiUsers />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Gerenciar Usuários</h3>
                <p className="action-card-description">
                  Visualize, edite e gerencie usuários do sistema
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/usuarios/novo" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiUserPlus />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Adicionar Usuário</h3>
                <p className="action-card-description">
                  Cadastre novos usuários no sistema
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/disciplinas" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiBookOpen />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Gerenciar Disciplinas</h3>
                <p className="action-card-description">
                  Visualize e gerencie disciplinas do currículo
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/turmas" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiCalendar />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Gerenciar Turmas</h3>
                <p className="action-card-description">
                  Visualize e gerencie turmas, professores e alunos
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/aulas" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiClock />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Gerenciar Aulas</h3>
                <p className="action-card-description">
                  Gerencie aulas, horários e registro de presença
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/presencas" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiCheckSquare />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Gerenciar Presenças</h3>
                <p className="action-card-description">
                  Registre e acompanhe a presença dos alunos
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/disciplinas/novo" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiBookOpen />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Criar Disciplina</h3>
                <p className="action-card-description">
                  Adicione uma nova disciplina ao catálogo
                </p>
              </div>
            </div>
          </Link>

          <Link to="/settings" className="action-card">
            <div className="flex items-center gap-4">
              <div className="action-card-icon">
                <FiSettings />
              </div>
              <div className="flex-1">
                <h3 className="action-card-title">Configurações</h3>
                <p className="action-card-description">
                  Gerencie as configurações do sistema
                </p>
              </div>
            </div>
          </Link>
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
          <Link to="/admin/aulas" className="btn btn-primary btn-sm">
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
          ) : todayLessons.length > 0 ? (
            <div>
              {todayLessons.slice(0, 5).map((lesson) => (
                <div key={lesson.id} className="list-card-item">
                  <div className="list-card-item-icon">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                      lesson.isOpen 
                        ? 'bg-success' 
                        : 'bg-gray-400'
                    }`}>
                      <FiClock className="w-6 h-6 text-white" />
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
                  <Link 
                    to={`/admin/aulas/${lesson.id}/editar`}
                    className="btn-premium-outline !px-4 !py-2 text-sm flex-shrink-0"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="empty-state-title">Nenhuma aula hoje</h3>
              <p className="empty-state-description">
                Não há aulas programadas para hoje. Que tal aproveitar para planejar as próximas aulas?
              </p>
              <Link to="/admin/aulas/novo" className="btn-premium mt-6">
                <FiClock className="w-5 h-5" />
                Criar Nova Aula
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

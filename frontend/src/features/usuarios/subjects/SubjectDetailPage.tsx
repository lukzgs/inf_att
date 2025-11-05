import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { useStudentClassDetail } from '@/hooks/useStudentClassDetail';
import { LabeledFrequencyBadge } from '@/components/ui/FrequencyBadge';
import { formatDate } from '@/utils/date/formatDate';

type FilterType = 'all' | 'absences';

/**
 * Extrai apenas a parte do horário (HH:mm) de uma string ISO datetime
 * Backend retorna Time do Prisma como "1970-01-01THH:mm:ss.000Z"
 */
const extractTimeFromISO = (isoTime: string): string => {
  if (!isoTime) return '--:--';
  try {
    // Se já for HH:mm, retorna direto
    if (isoTime.length === 5 && isoTime.includes(':')) {
      return isoTime;
    }
    // Se for ISO completo, extrai HH:mm
    const date = new Date(isoTime);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC' // Importante: usa UTC porque 1970-01-01 é apenas container
    });
  } catch {
    return '--:--';
  }
};

/**
 * Página de detalhes de uma disciplina do aluno
 * 
 * Features:
 * - Informações da disciplina (nome, código, carga horária)
 * - Estatísticas de frequência
 * - Lista de todas as aulas com status de presença
 * - Filtro: Todas / Apenas Faltas
 * - Ordenação por data (mais recente primeiro)
 * 
 * Route: /usuario/subjects/:id
 */
export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = id ? parseInt(id, 10) : undefined;
  
  const [filter, setFilter] = useState<FilterType>('all');
  
  const { data: classDetail, isLoading } = useStudentClassDetail(classId);

  // Filtrar aulas baseado no filtro selecionado
  const filteredLessons = useMemo(() => {
    if (!classDetail?.lessons) return [];
    
    if (filter === 'absences') {
      return classDetail.lessons.filter(
        lesson => lesson.attendanceStatus === 'absent'
      );
    }
    
    return classDetail.lessons;
  }, [classDetail?.lessons, filter]);

  // Estatísticas para o filtro atual
  const stats = useMemo(() => {
    const total = filteredLessons.length;
    const present = filteredLessons.filter(l => l.attendanceStatus === 'present').length;
    const absent = filteredLessons.filter(l => l.attendanceStatus === 'absent').length;
    const justified = filteredLessons.filter(l => l.attendanceStatus === 'justified').length;
    const pending = filteredLessons.filter(l => l.attendanceStatus === 'pending').length;
    
    return { total, present, absent, justified, pending };
  }, [filteredLessons]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-8 w-64" />
        </div>
        <div className="skeleton h-32 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-error">
          <FiAlertCircle className="w-5 h-5" />
          <span>Disciplina não encontrada</span>
        </div>
        <Link to="/usuario/turmas" className="btn btn-ghost mt-4">
          <FiArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className="w-5 h-5 text-success" />;
      case 'absent':
        return <FiXCircle className="w-5 h-5 text-error" />;
      case 'justified':
        return <FiAlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <FiClock className="w-5 h-5 text-base-content/50" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Falta';
      case 'justified':
        return 'Justificada';
      default:
        return 'Pendente';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'badge badge-success badge-sm';
      case 'absent':
        return 'badge badge-error badge-sm';
      case 'justified':
        return 'badge badge-warning badge-sm';
      default:
        return 'badge badge-ghost badge-sm';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/usuario/turmas" 
          className="btn btn-ghost btn-sm mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
              {classDetail.subject?.name || 'Disciplina'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
              <span className="font-mono font-semibold">
                {classDetail.subject?.code}
              </span>
              <span>•</span>
              <span>Turma {classDetail.code}</span>
              <span>•</span>
              <span>{classDetail.year}/{classDetail.semester}</span>
              {classDetail.subject?.credits && (
                <>
                  <span>•</span>
                  <span>{classDetail.subject.credits} créditos</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Frequência */}
            <div className="flex flex-col">
              <span className="text-sm text-base-content/70 mb-2">Frequência</span>
              <LabeledFrequencyBadge 
                percentage={classDetail.attendancePercentage} 
                size="lg"
              />
            </div>

            {/* Total de Aulas */}
            <div className="flex flex-col">
              <span className="text-sm text-base-content/70 mb-2">Total de Aulas</span>
              <span className="text-2xl font-bold">{classDetail.totalLessons}</span>
            </div>

            {/* Presenças */}
            <div className="flex flex-col">
              <span className="text-sm text-base-content/70 mb-2">Presenças</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-success">
                  {classDetail.totalPresent}
                </span>
                <span className="text-sm text-base-content/50">
                  de {classDetail.totalLessons}
                </span>
              </div>
            </div>

            {/* Faltas */}
            <div className="flex flex-col">
              <span className="text-sm text-base-content/70 mb-2">Faltas</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-error">
                  {classDetail.totalAbsent}
                </span>
                <span className="text-sm text-base-content/50">
                  de {classDetail.totalLessons}
                </span>
              </div>
            </div>
          </div>

          {/* Alert de frequência crítica */}
          {classDetail.frequencyStatus === 'error' && (
            <div className="alert alert-error mt-4">
              <FiAlertCircle className="w-5 h-5" />
              <span>
                <strong>Atenção!</strong> Sua frequência está abaixo do mínimo exigido (75%).
              </span>
            </div>
          )}
          
          {classDetail.frequencyStatus === 'warning' && (
            <div className="alert alert-warning mt-4">
              <FiAlertCircle className="w-5 h-5" />
              <span>
                <strong>Cuidado!</strong> Sua frequência está próxima do limite mínimo.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold">Histórico de Aulas</h2>
        
        <div className="join">
          <button
            className={`btn join-item btn-sm ${filter === 'all' ? 'btn-accent' : 'btn-ghost'}`}
            onClick={() => setFilter('all')}
          >
            <FiFilter className="w-4 h-4" />
            Todas ({classDetail.lessons.length})
          </button>
          <button
            className={`btn join-item btn-sm ${filter === 'absences' ? 'btn-accent' : 'btn-ghost'}`}
            onClick={() => setFilter('absences')}
          >
            <FiXCircle className="w-4 h-4" />
            Faltas ({classDetail.totalAbsent})
          </button>
        </div>
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="card bg-base-100 shadow">
          <div className="card-body text-center py-12">
            <FiCalendar className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
            <p className="text-base-content/70">
              {filter === 'absences' 
                ? '🎉 Você não tem faltas nesta disciplina!'
                : 'Nenhuma aula registrada ainda.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Left: Date, Time, Topic */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(lesson.attendanceStatus)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Topic */}
                      {lesson.topic && (
                        <h3 className="font-semibold text-base-content mb-1 truncate">
                          {lesson.topic}
                        </h3>
                      )}
                      
                      {/* Date and Time */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>{formatDate(lesson.date)}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{extractTimeFromISO(lesson.startTime)} - {extractTimeFromISO(lesson.endTime)}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      {lesson.description && (
                        <p className="text-sm text-base-content/60 mt-2 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <span className={getStatusBadgeClass(lesson.attendanceStatus)}>
                      {getStatusText(lesson.attendanceStatus)}
                    </span>
                    
                    {lesson.isOpen && lesson.attendanceStatus === 'pending' && (
                      <span className="badge badge-info badge-sm">
                        Aberta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary (visible when filtered) */}
      {filter === 'absences' && filteredLessons.length > 0 && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiXCircle className="w-4 h-4 text-error" />
              <span><strong>{stats.absent}</strong> falta{stats.absent !== 1 ? 's' : ''}</span>
            </div>
            {stats.justified > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 text-warning" />
                  <span><strong>{stats.justified}</strong> justificada{stats.justified !== 1 ? 's' : ''}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

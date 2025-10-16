import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  FiArrowLeft,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiBookOpen,
  FiUserCheck,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiFilter,
  FiChevronDown,
} from 'react-icons/fi';
import { useClass } from '@/hooks/useClasses';
import { formatNameToInitials } from '@/utils/format';
import { FrequencyBadge } from '@/components/ui/FrequencyBadge';
import { LessonDetailModal } from '@/components/professor/LessonDetailModal';
import { CreateLessonModal } from '@/components/professor/CreateLessonModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type FilterType = 'all' | 'finished' | 'scheduled';

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
 * Formata uma data ISO em formato dd/mm usando UTC para evitar problemas de timezone
 * Backend retorna Date como "2025-10-09T00:00:00.000Z" (meia-noite UTC)
 */
const formatDateDDMM = (isoDate: string): string => {
  if (!isoDate) return '--/--';
  try {
    const date = new Date(isoDate);
    // Usa UTC para extrair dia/mês sem conversão de timezone
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch {
    return '--/--';
  }
};

/**
 * ClassDetailPage - Página de detalhes da turma para Professor
 * 
 * Features:
 * - Informações gerais da turma (disciplina, código, período)
 * - Card de estatísticas (total alunos, aulas realizadas, média de frequência)
 * - Lista de alunos matriculados com % de frequência
 * - Histórico de aulas (realizadas e agendadas)
 * - Filtros de aulas (todas, realizadas, agendadas)
 * - Botão "Abrir Aula" para aulas futuras/hoje
 * - Loading states e empty states
 * 
 * Rota: /professor/turmas/:id
 */
export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = id ? parseInt(id) : 0;
  const queryClient = useQueryClient();

  const [lessonFilter, setLessonFilter] = useState<FilterType>('all');
  const [showStudents, setShowStudents] = useState(false);
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<Set<number>>(new Set());
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const [lessonDetailModalData, setLessonDetailModalData] = useState<{
    lessonId: number;
    className: string;
  } | null>(null);

  // Fetch class data (já inclui lessons e users)
  const { data: classData, isLoading: isLoadingClass } = useClass(classId);
  
  // Extract lessons from class data
  const lessonsData = classData?.lessons || [];
  const isLoadingLessons = isLoadingClass;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilterDropdown && !target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  // Extract students from class users
  const students = classData?.users?.filter(uc => uc.role === 'STUDENT') || [];

  // Calculate students stats
  const studentsWithStats = students.map(student => {
    // TODO: Calculate real attendance percentage per student
    // For now, using mock data - will be replaced with real calculation
    const totalLessons = lessonsData?.filter(l => l.closedAt).length || 0;
    const attendances = Math.floor(Math.random() * totalLessons); // Mock
    const percentage = totalLessons > 0 ? (attendances / totalLessons) * 100 : 0;

    return {
      ...student,
      attendancePercentage: percentage,
      totalAttendances: attendances,
      totalLessons,
    };
  });

  // Sort students by name
  studentsWithStats.sort((a, b) => 
    (a.user?.name || '').localeCompare(b.user?.name || '')
  );

  // Calculate class average frequency
  const avgFrequency = studentsWithStats.length > 0
    ? studentsWithStats.reduce((sum, s) => sum + s.attendancePercentage, 0) / studentsWithStats.length
    : 0;

  // Filter lessons
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  
  const filteredLessons = lessonsData?.filter(lesson => {
    if (lessonFilter === 'finished') {
      return lesson.closedAt !== null;
    }
    if (lessonFilter === 'scheduled') {
      return lesson.closedAt === null;
    }
    return true;
  }) || [];

  // Sort lessons by proximity (upcoming first, then most recent past)
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    // Cria Date completo com data + horário para comparação precisa
    // Extrai ano/mês/dia em UTC para preservar a data correta
    const dateA = new Date(a.date);
    const yearA = dateA.getUTCFullYear();
    const monthA = dateA.getUTCMonth();
    const dayA = dateA.getUTCDate();
    const startTimeA = extractTimeFromISO(a.startTime);
    const [hourA, minA] = startTimeA.split(':').map(Number);
    // Cria em timezone LOCAL para comparar com now (que é local)
    const dateTimeA = new Date(yearA, monthA, dayA, hourA, minA, 0, 0);
    
    const dateB = new Date(b.date);
    const yearB = dateB.getUTCFullYear();
    const monthB = dateB.getUTCMonth();
    const dayB = dateB.getUTCDate();
    const startTimeB = extractTimeFromISO(b.startTime);
    const [hourB, minB] = startTimeB.split(':').map(Number);
    const dateTimeB = new Date(yearB, monthB, dayB, hourB, minB, 0, 0);
    
    const timeA = dateTimeA.getTime();
    const timeB = dateTimeB.getTime();
    const nowTime = now.getTime();

    // Se ambas são futuras, ordena pela mais próxima (ascendente)
    if (timeA >= nowTime && timeB >= nowTime) {
      return timeA - timeB;
    }
    
    // Se ambas são passadas, ordena pela mais recente (descendente)
    if (timeA < nowTime && timeB < nowTime) {
      return timeB - timeA;
    }
    
    // Se uma é futura e outra passada, futura vem primeiro
    return timeA >= nowTime ? -1 : 1;
  });

  // Funções de seleção
  const toggleLessonSelection = (lessonId: number) => {
    setSelectedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLessons.size === sortedLessons.length) {
      setSelectedLessons(new Set());
    } else {
      setSelectedLessons(new Set(sortedLessons.map(l => l.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLessons.size === 0) return;

    setIsDeletingMultiple(true);
    const token = localStorage.getItem('authToken');
    let deletedCount = 0;
    let errorCount = 0;

    try {
      // Deleta todas as aulas selecionadas
      await Promise.all(
        Array.from(selectedLessons).map(async (lessonId) => {
          try {
            const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              deletedCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
          }
        })
      );

      // Atualiza a lista
      await queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      await queryClient.refetchQueries({ queryKey: ['classes', classId] });

      // Limpa seleção
      setSelectedLessons(new Set());
      setShowDeleteConfirm(false);

      // Mostra resultado
      if (deletedCount > 0) {
        toast.success(`${deletedCount} aula(s) deletada(s) com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`Erro ao deletar ${errorCount} aula(s)`);
      }
    } catch (error) {
      console.error('Erro ao deletar aulas:', error);
      toast.error('Erro ao deletar aulas selecionadas');
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const isLoading = isLoadingClass || isLoadingLessons;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="skeleton-premium h-20 w-full" />
        <div className="skeleton-premium h-48 w-full" />
        <div className="skeleton-premium h-96 w-full" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="empty-state">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="empty-state-title">Turma não encontrada</h3>
        <p className="empty-state-description">
          A turma solicitada não existe ou você não tem permissão para acessá-la.
        </p>
        <Link to="/professor" className="btn-premium mt-6">
          <FiArrowLeft />
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Compact Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Código - Turma */}
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 truncate">
              {classData.subject?.code} - Turma {classData.code}
            </h1>
            {/* Nome da Disciplina • Ano/Semestre */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2">
              {classData.subject?.name} • {classData.year}/{classData.semester}
            </p>
          </div>
          <Link 
            to="/dashboard"
            className="btn-premium-outline gap-2 text-sm sm:text-base p-2 sm:px-6 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform flex-shrink-0 sm:w-44 justify-center"
          >
            <FiArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
        </div>
      </div>

      {/* Lessons List */}
      <section className="bg-white dark:bg-base-100 rounded-2xl border border-gray-200 dark:border-base-300 shadow-md overflow-hidden">
        {/* Header: Título e Botão Nova Aula */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-gray-100 dark:border-base-300">
          <div className="min-w-0">
            <h2 className="section-title mb-0 text-xl sm:text-3xl md:text-4xl">Aulas</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              {lessonsData?.length || 0} aula(s) total
            </p>
          </div>
          <button
            onClick={() => setIsCreateLessonModalOpen(true)}
            className="btn-premium gap-2 text-sm sm:text-base p-2 sm:px-6 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform flex-shrink-0 sm:w-44 justify-center"
          >
            <FiPlus className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Nova Aula</span>
          </button>
        </div>

        {/* Filtro e Controles de Seleção */}
        <div className="flex items-center justify-end p-3 sm:p-5 border-b border-gray-100 dark:border-base-300">
          {/* Dropdown de Filtro - Alinhado à direita */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="btn-premium gap-2 text-sm sm:text-base p-2 sm:px-6 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform sm:w-44 justify-center"
            >
              <FiFilter className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">
                {lessonFilter === 'all' && 'Todas'}
                {lessonFilter === 'finished' && 'Realizadas'}
                {lessonFilter === 'scheduled' && 'Agendadas'}
              </span>
              <FiChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - Alinhado à direita */}
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-base-100 border border-gray-200 dark:border-base-300 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setLessonFilter('all');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    lessonFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => {
                    setLessonFilter('finished');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    lessonFilter === 'finished'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-200'
                  }`}
                >
                  Realizadas
                </button>
                <button
                  onClick={() => {
                    setLessonFilter('scheduled');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    lessonFilter === 'scheduled'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-200'
                  }`}
                >
                  Agendadas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="list-card !border-0 !shadow-none !rounded-none">
          {sortedLessons.length === 0 ? (
            <div className="empty-state">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="empty-state-title">
                {lessonFilter === 'all' && 'Nenhuma aula cadastrada'}
                {lessonFilter === 'finished' && 'Nenhuma aula realizada'}
                {lessonFilter === 'scheduled' && 'Nenhuma aula agendada'}
              </h3>
              <p className="empty-state-description">
                {lessonFilter === 'all' && 'Ainda não há aulas cadastradas para esta turma.'}
                {lessonFilter === 'finished' && 'Ainda não há aulas realizadas.'}
                {lessonFilter === 'scheduled' && 'Não há aulas agendadas no momento.'}
              </p>
            </div>
          ) : (
            <div>
              {/* Header com checkbox Selecionar Todas */}
              {sortedLessons.length > 0 && (
                <div className="flex items-center justify-end gap-4 sm:gap-6 p-3 sm:p-5 border-b border-gray-100 dark:border-base-300">
                  {selectedLessons.size > 0 && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeletingMultiple}
                      className="btn-premium-outline gap-2 text-sm sm:text-base p-2 sm:px-6 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform sm:w-44 justify-center bg-red-500 hover:bg-red-600 text-white border-red-500"
                    >
                      <FiTrash2 className="w-5 h-5 flex-shrink-0" />
                      <span className="hidden sm:inline">Deletar</span>
                    </button>
                  )}
                  <input
                    type="checkbox"
                    className="checkbox-custom-primary"
                    checked={selectedLessons.size === sortedLessons.length && sortedLessons.length > 0}
                    onChange={toggleSelectAll}
                    title="Selecionar todas"
                  />
                </div>
              )}

              {sortedLessons.map((lesson, index) => {
                // Extrai data em UTC para preservar o dia correto
                const lessonDateUTC = new Date(lesson.date);
                const year = lessonDateUTC.getUTCFullYear();
                const month = lessonDateUTC.getUTCMonth();
                const day = lessonDateUTC.getUTCDate();
                
                // Extrai horários
                const startTimeStr = extractTimeFromISO(lesson.startTime);
                const endTimeStr = extractTimeFromISO(lesson.endTime);
                const [startHour, startMin] = startTimeStr.split(':').map(Number);
                const [endHour, endMin] = endTimeStr.split(':').map(Number);
                
                // Cria datetime completo
                const startTime = new Date(year, month, day, startHour, startMin, 0, 0);
                const endTime = new Date(year, month, day, endHour, endMin, 0, 0);
                const now = new Date();
                
                const isToday = lesson.date.startsWith(today);
                const isFuture = startTime > now;
                const isFinished = now > endTime; // Concluída quando passou o horário

                const handleLessonClick = () => {
                  setLessonDetailModalData({
                    lessonId: lesson.id,
                    className: `${classData.code} - ${classData.subject?.name}`,
                  });
                };

                return (
                  <div 
                    key={lesson.id} 
                    className="list-card-item sm:cursor-default cursor-pointer active:bg-gray-200 dark:active:bg-base-300 sm:active:bg-transparent"
                    onClick={(e) => {
                      // No mobile, clica no card inteiro (exceto no checkbox)
                      if (window.innerWidth < 640 && !(e.target as HTMLElement).closest('input[type="checkbox"]')) {
                        handleLessonClick();
                      }
                    }}
                  >
                    {/* Status Icon */}
                    <div className="list-card-item-icon">
                      <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                        lesson.isOpen 
                          ? 'bg-primary'
                          : isFinished
                          ? 'bg-success'
                          : isFuture
                          ? 'bg-warning'
                          : 'bg-gray-400'
                      }`}>
                        {lesson.isOpen ? (
                          <FiBookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : isFinished ? (
                          <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : isFuture ? (
                          <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : (
                          <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Nome da Aula como título principal */}
                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                          {lesson.name || `Aula ${index + 1}`}
                        </p>
                        {lesson.isOpen && (
                          <span className="badge-premium badge-premium-primary text-xs sm:text-sm flex-shrink-0">
                            <FiBookOpen className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Em andamento</span>
                          </span>
                        )}
                        {isToday && !lesson.isOpen && (
                          <span className="badge-premium badge-premium-warning text-xs sm:text-sm flex-shrink-0">
                            Hoje
                          </span>
                        )}
                      </div>
                      {/* Data e horário como informação secundária */}
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70">
                        {formatDateDDMM(lesson.date)} • {extractTimeFromISO(lesson.startTime)} - {extractTimeFromISO(lesson.endTime)}
                        {lesson.description && ` • ${lesson.description}`}
                        {lesson.closedAt && (
                          <span className="ml-2 hidden sm:inline">
                            • Fechada às {new Date(lesson.closedAt).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions and Checkbox */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 ml-auto">
                      {/* Status Badge com lógica automática */}
                      {(() => {
                        const now = new Date();
                        
                        // Extrai data em UTC para preservar o dia correto
                        const lessonDateUTC = new Date(lesson.date);
                        const year = lessonDateUTC.getUTCFullYear();
                        const month = lessonDateUTC.getUTCMonth();
                        const day = lessonDateUTC.getUTCDate();
                        
                        // Extrai HH:mm do formato ISO
                        const startTimeStr = extractTimeFromISO(lesson.startTime);
                        const endTimeStr = extractTimeFromISO(lesson.endTime);
                        const [startHour, startMin] = startTimeStr.split(':').map(Number);
                        const [endHour, endMin] = endTimeStr.split(':').map(Number);
                        
                        // Cria datetime em timezone LOCAL para comparar com now
                        // Usa ano/mês/dia extraídos de UTC, mas cria em timezone local
                        const startTime = new Date(year, month, day, startHour, startMin, 0, 0);
                        const endTime = new Date(year, month, day, endHour, endMin, 0, 0);

                        // Presença aberta (durante o horário)
                        if (now >= startTime && now <= endTime && !lesson.closedAt) {
                          return (
                            <div className="hidden sm:flex items-center gap-4">
                              <FiUserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLessonClick();
                                }}
                                className="btn-premium-outline gap-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform"
                              >
                                <FiEdit className="w-5 h-5 flex-shrink-0" />
                                <span className="hidden sm:inline">Gerenciar</span>
                              </button>
                            </div>
                          );
                        }

                        // Aula encerrada (horário passou)
                        if (isFinished) {
                          return (
                            <div className="hidden sm:flex items-center gap-4">
                              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLessonClick();
                                }}
                                className="btn-premium-outline gap-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform"
                              >
                                <FiEdit className="w-5 h-5 flex-shrink-0" />
                                <span className="hidden sm:inline">Detalhes</span>
                              </button>
                            </div>
                          );
                        }

                        // Aula agendada (ainda não começou)
                        return (
                          <div className="hidden sm:flex items-center gap-4">
                            <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLessonClick();
                              }}
                              className="btn-premium-outline gap-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform"
                            >
                              <FiEdit className="w-5 h-5 flex-shrink-0" />
                              <span className="hidden sm:inline">Gerenciar</span>
                            </button>
                          </div>
                        );
                      })()}

                      {/* Checkbox de seleção */}
                      <input
                        type="checkbox"
                        className="checkbox-custom-primary"
                        checked={selectedLessons.has(lesson.id)}
                        onChange={() => toggleLessonSelection(lesson.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Students List - Collapsible */}
      <section className="mt-8">
        <div className="bg-white dark:bg-base-100 rounded-2xl shadow-md border border-gray-200 dark:border-base-300 overflow-hidden">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-base-200/50 transition-colors border-b border-gray-100 dark:border-base-300"
            onClick={() => setShowStudents(!showStudents)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                <FiUsers className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Alunos Matriculados
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {students.length} aluno(s) • Frequência média: {avgFrequency.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${showStudents ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {showStudents && (
            <div className="p-6">
              <div className="list-card !border-0 !shadow-none animate-fade-in-up">
                {students.length === 0 ? (
                  <div className="empty-state py-8">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="empty-state-title">Nenhum aluno matriculado</h3>
                    <p className="empty-state-description">
                      Ainda não há alunos matriculados nesta turma.
                    </p>
                  </div>
                ) : (
                  <div>
                    {studentsWithStats.map((student) => (
                      <div key={student.userId} className="list-card-item">
                        {/* Avatar */}
                        <div className="list-card-item-icon">
                          <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                            {formatNameToInitials(student.user?.name || 'N/A')}
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {student.user?.name || 'Nome não disponível'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-base-content/70">
                            {student.totalAttendances} de {student.totalLessons} presenças registradas
                          </p>
                        </div>

                        {/* Frequency Badge */}
                        <div className="flex-shrink-0">
                          <FrequencyBadge percentage={student.attendancePercentage} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lesson Detail Modal */}
      {lessonDetailModalData && (
        <LessonDetailModal
          isOpen={true}
          lessonId={lessonDetailModalData.lessonId}
          classId={classId}
          className={lessonDetailModalData.className}
          onClose={() => setLessonDetailModalData(null)}
          onUpdate={async () => {
            // Invalida as queries e força refetch imediato
            await queryClient.invalidateQueries({ queryKey: ['classes', classId] });
            await queryClient.refetchQueries({ queryKey: ['classes', classId] });
          }}
        />
      )}

      {/* Create Lesson Modal */}
      {isCreateLessonModalOpen && (
        <CreateLessonModal
          isOpen={isCreateLessonModalOpen}
          onClose={() => setIsCreateLessonModalOpen(false)}
          classId={classId}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSelected}
        title="Deletar Aulas"
        message={`Tem certeza que deseja deletar ${selectedLessons.size} aula(s)? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        confirmButtonClass="btn-error"
        isLoading={isDeletingMultiple}
      />
    </div>
  );
}

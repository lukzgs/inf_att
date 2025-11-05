import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  FiArrowLeft,
  FiPlus,
} from 'react-icons/fi';
import { useClass } from '@/hooks/useClasses';
import { formatNameToInitials } from '@/utils/format';
import { LessonDetailModal } from '@/components/professor/LessonDetailModal';
import { CreateLessonModal } from '@/components/professor/CreateLessonModal';
import { LessonCard } from '@/components/lessons/LessonCard';
import { LessonStatusFilter } from '@/components/lessons/LessonStatusFilter';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ClassInfoPanel } from '@/components/professor/ClassInfoPanel';
import { filterLessonsByStatus } from '@/utils/lessonStatus';

type FilterType = 'all' | 'completed' | 'scheduled';

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
 * Extrai apenas a parte do horário (HH:mm) de uma string ISO datetime
 * Backend retorna Time do Prisma como "1970-01-01THH:mm:ss.000Z"
 */

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
  
  const [lessonDetailModalData, setLessonDetailModalData] = useState<{
    lessonId: number;
    className: string;
  } | null>(null);

  // Estado para modal de confirmação de deleção
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    lessonId: number | null;
    lessonName: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    lessonId: null,
    lessonName: '',
    isLoading: false,
  });

  // Fetch class data (já inclui lessons e users)
  const { data: classData, isLoading: isLoadingClass } = useClass(classId);
  
  // Extract lessons from class data
  const lessonsData = classData?.lessons || [];
  const isLoadingLessons = isLoadingClass;

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

  // Filter lessons using the lessonStatus utility
  const filteredLessons = filterLessonsByStatus(lessonsData || [], lessonFilter);

  // Sort lessons with smart ordering based on filter
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    // Cria Date completo com data + horário para comparação precisa
    const dateA = new Date(a.date);
    const yearA = dateA.getUTCFullYear();
    const monthA = dateA.getUTCMonth();
    const dayA = dateA.getUTCDate();
    const startTimeA = extractTimeFromISO(a.startTime);
    const [hourA, minA] = startTimeA.split(':').map(Number);
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
    
    // Para aulas agendadas (scheduled), sempre mostrar próximas primeiro (crescente)
    if (lessonFilter === 'scheduled') {
      return timeA - timeB;
    }
    
    // Para aulas realizadas (completed), sempre mostrar recentes primeiro (decrescente)
    if (lessonFilter === 'completed') {
      return timeB - timeA;
    }
    
    // Para "todas" (all), ordem cronológica simples (crescente - mais antiga primeiro)
    return timeA - timeB;
  });



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

  // Função para deletar aula (chamada do modal de confirmação)
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.lessonId) return;

    setDeleteConfirmation((prev) => ({ ...prev, isLoading: true }));

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${deleteConfirmation.lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Aula deletada com sucesso!');
        setDeleteConfirmation({
          isOpen: false,
          lessonId: null,
          lessonName: '',
          isLoading: false,
        });
        await queryClient.refetchQueries({ queryKey: ['classes', classId] });
      } else {
        toast.error('Erro ao deletar aula');
        setDeleteConfirmation((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      toast.error('Erro ao deletar aula');
      setDeleteConfirmation((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Class Info Panel */}
      <ClassInfoPanel
        subjectCode={classData.subject?.code || '---'}
        subjectName={classData.subject?.name || '---'}
        classCode={classData.code}
        year={classData.year}
        semester={classData.semester}
        credits={classData.subject?.credits || 0}
        totalStudents={students.length}
        totalLessons={lessonsData?.length || 0}
        onBack={() => window.history.back()}
      />

      {/* Lessons Section */}
      <section className="mt-8">
        <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
          {/* Header: Título e Botão Nova Aula */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-0 border-b border-gray-200 dark:border-base-content/10 pb-2 inline-block">
                Aulas
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                {lessonsData?.length || 0} aula{lessonsData?.length !== 1 ? 's' : ''} cadastrada{lessonsData?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setIsCreateLessonModalOpen(true)}
              className="flex-shrink-0 btn-premium gap-2 text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:sm:scale-105 active:scale-95 transition-transform"
            >
              <FiPlus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Nova Aula</span>
            </button>
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Filtrar:</span>
            <LessonStatusFilter 
              value={lessonFilter}
              onChange={setLessonFilter}
            />
          </div>

          {/* Lessons List - Grid Layout */}
          {sortedLessons.length === 0 ? (
            <div className="empty-state">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="empty-state-title">
                {lessonFilter === 'all' && 'Nenhuma aula cadastrada'}
                {lessonFilter === 'completed' && 'Nenhuma aula realizada'}
                {lessonFilter === 'scheduled' && 'Nenhuma aula agendada'}
              </h3>
              <p className="empty-state-description">
                {lessonFilter === 'all' && 'Ainda não há aulas cadastradas para esta turma.'}
                {lessonFilter === 'completed' && 'Ainda não há aulas realizadas.'}
                {lessonFilter === 'scheduled' && 'Não há aulas agendadas no momento.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {sortedLessons.map((lesson) => {
                  const handleLessonClick = () => {
                    setLessonDetailModalData({
                      lessonId: lesson.id,
                      className: `${classData.code} - ${classData.subject?.name}`,
                    });
                  };

                  const handleDeleteLesson = () => {
                    setDeleteConfirmation({
                      isOpen: true,
                      lessonId: lesson.id,
                      lessonName: lesson.name || `Aula ${lesson.id}`,
                      isLoading: false,
                    });
                  };

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onView={handleLessonClick}
                      onEdit={handleLessonClick}
                      onDelete={handleDeleteLesson}
                      allLessons={lessonsData}
                    />
                  );
                })}
              </div>
          )}
        </div>
      </section>

      {/* Students List - Collapsible */}
      <section className="mt-8">
        <div className="bg-white dark:bg-base-100 rounded-2xl shadow-md border border-gray-200 dark:border-base-300">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-base-200/50 transition-colors border-b border-gray-100 dark:border-base-300"
            onClick={() => setShowStudents(!showStudents)}
          >
            <div className="flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-0 border-b border-gray-200 dark:border-base-content/10 pb-2 inline-block">
                Alunos Matriculados
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                {students.length} aluno{students.length !== 1 ? 's' : ''} • Frequência média: {avgFrequency.toFixed(1)}%
              </p>
            </div>
            <div className={`transition-transform duration-300 flex-shrink-0 ml-4 ${showStudents ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-gray-600 dark:text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {showStudents && (
            <div className="p-6">
              {students.length === 0 ? (
                <div className="empty-state py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="empty-state-title">Nenhum aluno matriculado</h3>
                  <p className="empty-state-description">
                    Ainda não há alunos matriculados nesta turma.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 animate-fade-in-up">
                  {studentsWithStats.map((student) => (
                    <div key={student.userId} className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm flex-shrink-0">
                          {formatNameToInitials(student.user?.name || 'N/A')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                            {student.user?.name || 'Nome não disponível'}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 dark:border-base-content/10 pt-3">
                        {/* Attendance Info */}
                        <div className="space-y-2">
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-600 dark:text-base-content/70 mb-1">Presenças</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {student.totalAttendances} de {student.totalLessons}
                            </p>
                          </div>
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-600 dark:text-base-content/70 mb-1">Frequência</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {student.attendancePercentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title="Deletar Aula"
        description="Você está prestes a deletar esta aula. Todos os dados relacionados (presenças, atividades, etc.) também serão removidos."
        itemName={deleteConfirmation.lessonName}
        isLoading={deleteConfirmation.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteConfirmation({
            isOpen: false,
            lessonId: null,
            lessonName: '',
            isLoading: false,
          })
        }
      />
    </div>
  );
}

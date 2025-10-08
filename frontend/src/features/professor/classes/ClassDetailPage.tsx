import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiUsers,
  FiClock,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
} from 'react-icons/fi';
import { useClass } from '@/hooks/useClasses';
import { formatNameToInitials } from '@/utils/format';
import { FrequencyBadge } from '@/components/ui/FrequencyBadge';
import { LessonDetailModal } from '@/components/professor/LessonDetailModal';
import OpenLessonModal from '@/features/professor/lessons/OpenLessonModal';
import ManualAttendanceForm from '@/features/professor/lessons/ManualAttendanceForm';

type FilterType = 'all' | 'finished' | 'scheduled';

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
  
  const [lessonDetailModalData, setLessonDetailModalData] = useState<{
    lessonId: number;
    className: string;
  } | null>(null);
  
  const [openLessonModalData, setOpenLessonModalData] = useState<{
    lessonId: number;
    className: string;
    lessonDate: string;
    totalStudents: number;
  } | null>(null);
  
  const [manualAttendanceData, setManualAttendanceData] = useState<{
    lessonId: number;
    className: string;
    lessonDate: string;
  } | null>(null);

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

  // Filter lessons
  const today = new Date().toISOString().split('T')[0];
  const filteredLessons = lessonsData?.filter(lesson => {
    if (lessonFilter === 'finished') {
      return lesson.closedAt !== null;
    }
    if (lessonFilter === 'scheduled') {
      return lesson.closedAt === null;
    }
    return true;
  }) || [];

  // Sort lessons by date (most recent first)
  const sortedLessons = [...filteredLessons].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
    <div className="animate-fade-in-up pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/professor"
          className="btn-premium-outline !p-3"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {classData.subject?.code} - {classData.subject?.name}
          </h1>
          <p className="text-base text-gray-600 dark:text-base-content/70">
            Turma {classData.code} • {classData.year}/{classData.semester} • {students.length} aluno(s) • {lessonsData?.filter(l => l.closedAt).length || 0} aula(s) realizadas
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Aulas</h2>
            <p className="section-subtitle">
              {lessonsData?.length || 0} aula(s) total
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLessonFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              lessonFilter === 'all'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-base-200 text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-300'
            }`}
          >
            Todas as aulas
          </button>
          <button
            onClick={() => setLessonFilter('finished')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              lessonFilter === 'finished'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-base-200 text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-300'
            }`}
          >
            Realizadas
          </button>
          <button
            onClick={() => setLessonFilter('scheduled')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              lessonFilter === 'scheduled'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-base-200 text-gray-700 dark:text-base-content hover:bg-gray-100 dark:hover:bg-base-300'
            }`}
          >
            Agendadas
          </button>
        </div>

        {/* Lessons List */}
        <div className="list-card">
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
              {sortedLessons.map((lesson) => {
                const lessonDate = new Date(lesson.date);
                const isToday = lesson.date.startsWith(today);
                const isFuture = lessonDate > new Date() || isToday;
                const isFinished = lesson.closedAt !== null;

                return (
                  <div key={lesson.id} className="list-card-item">
                    {/* Status Icon */}
                    <div className="list-card-item-icon">
                      <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                        lesson.isOpen 
                          ? 'bg-success'
                          : isFinished
                          ? 'bg-info'
                          : isFuture
                          ? 'bg-warning'
                          : 'bg-gray-400'
                      }`}>
                        {lesson.isOpen ? (
                          <FiPlay className="w-6 h-6 text-white" />
                        ) : isFinished ? (
                          <FiCheckCircle className="w-6 h-6 text-white" />
                        ) : isFuture ? (
                          <FiClock className="w-6 h-6 text-white" />
                        ) : (
                          <FiXCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {lessonDate.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        {lesson.isOpen && (
                          <span className="badge-premium badge-premium-success">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-1" />
                            Aberta
                          </span>
                        )}
                        {isToday && !lesson.isOpen && (
                          <span className="badge-premium badge-premium-warning">
                            Hoje
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-base-content/70">
                        {lesson.startTime?.substring(0, 5)} - {lesson.endTime?.substring(0, 5)}
                        {lesson.description && ` • ${lesson.description}`}
                        {lesson.closedAt && (
                          <span className="ml-2">
                            • Fechada às {new Date(lesson.closedAt).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {lesson.isOpen ? (
                        <button 
                          onClick={() => setOpenLessonModalData({
                            lessonId: lesson.id,
                            className: `${classData.code} - ${classData.subject?.name}`,
                            lessonDate: lesson.date,
                            totalStudents: students.length,
                          })}
                          className="btn-premium-outline !px-4 !py-2 text-sm bg-error/10 border-error text-error hover:bg-error hover:text-white"
                        >
                          Fechar Aula
                        </button>
                      ) : (
                        <>
                          {isFuture && !isFinished && (
                            <button 
                              onClick={() => setOpenLessonModalData({
                                lessonId: lesson.id,
                                className: `${classData.code} - ${classData.subject?.name}`,
                                lessonDate: lesson.date,
                                totalStudents: students.length,
                              })}
                              className="btn-premium !px-4 !py-2 text-sm"
                            >
                              <FiPlay className="w-4 h-4" />
                              Abrir Aula
                            </button>
                          )}
                          <button
                            onClick={() => setLessonDetailModalData({
                              lessonId: lesson.id,
                              className: `${classData.code} - ${classData.subject?.name}`,
                            })}
                            className="btn-premium-outline !px-4 !py-2 text-sm"
                          >
                            <FiEdit className="w-4 h-4" />
                            Gerenciar Aula
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Students List - Collapsible */}
      <section>
        <div 
          className="flex items-center justify-between p-4 bg-white dark:bg-base-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowStudents(!showStudents)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
              <FiUsers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Alunos Matriculados
              </h2>
              <p className="text-sm text-gray-600 dark:text-base-content/70">
                {students.length} aluno(s) • Frequência média: {avgFrequency.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className={`transition-transform ${showStudents ? 'rotate-180' : ''}`}>
            <svg className="w-6 h-6 text-gray-600 dark:text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {showStudents && (
          <div className="list-card mt-4 animate-fade-in-up">
            {students.length === 0 ? (
              <div className="empty-state">
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
        )}
      </section>

      {/* Open Lesson Modal */}
      {openLessonModalData && (
        <OpenLessonModal
          lessonId={openLessonModalData.lessonId}
          className={openLessonModalData.className}
          lessonDate={openLessonModalData.lessonDate}
          totalStudents={openLessonModalData.totalStudents}
          onClose={() => setOpenLessonModalData(null)}
        />
      )}

      {/* Manual Attendance Form */}
      {manualAttendanceData && (
        <ManualAttendanceForm
          lessonId={manualAttendanceData.lessonId}
          classId={classId}
          className={manualAttendanceData.className}
          lessonDate={manualAttendanceData.lessonDate}
          onClose={() => setManualAttendanceData(null)}
        />
      )}

      {/* Lesson Detail Modal */}
      {lessonDetailModalData && (
        <LessonDetailModal
          isOpen={true}
          lessonId={lessonDetailModalData.lessonId}
          classId={classId}
          className={lessonDetailModalData.className}
          onClose={() => setLessonDetailModalData(null)}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['classes', classId] });
            queryClient.invalidateQueries({ queryKey: ['lessons', 'class', classId] });
          }}
        />
      )}
    </div>
  );
}

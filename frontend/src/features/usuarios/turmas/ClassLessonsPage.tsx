import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBook, FiClipboard } from 'react-icons/fi';
import { useClassLessons } from '@/hooks/useLessons';
import { useStudentClasses } from '@/hooks/useStudentClasses';
import { LessonCard } from '@/components/lessons/LessonCard';
import { LessonStatusFilter } from '@/components/lessons/LessonStatusFilter';
import { LessonAttendanceModal } from '../aulas/LessonAttendanceModal';
import { useAuth } from '@/contexts/AuthContext';
import { filterLessonsByStatus } from '@/utils/lessonStatus';
import { compareLessonsByTime } from '@/utils/lessons/compareLessonsByTime';

/**
 * Página de Aulas de uma Turma Específica
 * 
 * Usa EXATAMENTE a mesma lógica, layout e estrutura de:
 * - /usuario/aulas (AulasPage)
 * 
 * Features:
 * - Informações da turma (nome, disciplina, código)
 * - Lista de aulas com LessonCard
 * - Filtro por status (Agendadas/Realizadas/Todas)
 * - Modal para marcar presença
 * - Mesmo layout grid 3 colunas
 * 
 * Route: /usuario/turmas/:id/aulas
 */
export default function ClassLessonsPage() {
  const { id } = useParams<{ id: string }>();
  const classId = id ? parseInt(id, 10) : undefined;
  const { user } = useAuth();
  
  const { data: classes, isLoading: isLoadingClasses } = useStudentClasses();
  const { data: lessons, isLoading: isLoadingLessons } = useClassLessons(classId);
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Encontrar a turma selecionada
  const selectedClass = useMemo(() => {
    if (!classes || !classId) return null;
    return classes.find(c => c.id === classId);
  }, [classes, classId]);

  // Obter todas as aulas da turma (SEM FILTRO) para cálculo de numeração
  const studentLessonsUnfiltered = useMemo(() => {
    if (!lessons) return [];
    
    const lessonsArray = Array.isArray(lessons) ? lessons : [];
    return lessonsArray;
  }, [lessons]);

  // Filtrar aulas com base nos filtros selecionados (status)
  const studentLessons = useMemo(() => {
    let filtered = [...studentLessonsUnfiltered];
    
    // Filtrar por status (agendadas/realizadas) usando função utilitária
    filtered = filterLessonsByStatus(filtered, filterStatus);
    
    // Ordenar por data - ordem cronológica (crescente - mais antiga primeiro)
    // A ordenação é consistente independente do filtro selecionado
    return filtered.sort((a, b) => compareLessonsByTime(a, b, true));
  }, [studentLessonsUnfiltered, filterStatus]);

  const isLoading = isLoadingClasses || isLoadingLessons;

  if (!selectedClass && !isLoading) {
    return (
      <div className="animate-fade-in-up">
        <Link 
          to="/usuario/turmas"
          className="btn btn-ghost gap-2 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar para Turmas
        </Link>
        <div className="alert alert-error">
          <span>Turma não encontrada</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiBook className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedClass?.subject?.code} - Turma {selectedClass?.code}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {selectedClass?.subject?.name}
              </p>
            </div>
          </div>
          <Link 
            to="/usuario/turmas"
            className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
            title="Voltar para Turmas"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Aulas Section */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Aulas
        </h2>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {/* Filtro por Status */}
            <LessonStatusFilter 
              value={filterStatus}
              onChange={setFilterStatus}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {studentLessons.length} aula{studentLessons.length !== 1 ? 's' : ''} cadastrada{studentLessons.length !== 1 ? 's' : ''}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-premium h-40 w-full" />
            ))}
          </div>
        ) : studentLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {studentLessons.map((lesson) => (
              <div key={lesson.id} className="relative">
                <LessonCard
                  lesson={lesson}
                  onView={() => {
                    setSelectedLesson(lesson);
                    setIsAttendanceModalOpen(true);
                  }}
                  onEdit={undefined}
                  onDelete={undefined}
                  allLessons={studentLessonsUnfiltered}
                  isStudent={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiClipboard className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-base-content/70 font-medium mb-2">
              Nenhuma aula encontrada
            </p>
            <p className="text-sm text-gray-500 dark:text-base-content/60">
              Tente ajustar os filtros
            </p>
          </div>
        )}
      </div>

      {/* Modal de Presença */}
      {selectedLesson && (
        <LessonAttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => {
            setIsAttendanceModalOpen(false);
            setSelectedLesson(null);
          }}
          lesson={selectedLesson}
          classId={selectedLesson.classId}
          userId={user?.id}
          onSuccess={() => {
            // Recarregar dados se necessário
          }}
        />
      )}
    </div>
  );
}

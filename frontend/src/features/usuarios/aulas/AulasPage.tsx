import { FiClipboard, FiSearch, FiX } from 'react-icons/fi';
import { useStudentClasses } from '@/hooks/useStudentClasses';
import { useLessons } from '@/hooks/useLessons';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LessonCard } from '@/components/lessons/LessonCard';
import { LessonStatusFilter } from '@/components/lessons/LessonStatusFilter';
import { LessonAttendanceModal } from './LessonAttendanceModal';
import { filterLessonsByStatus } from '@/utils/lessonStatus';
import { compareLessonsByTime } from '@/utils/lessons/compareLessonsByTime';

/**
 * Página de Aulas do Aluno
 * 
 * Exibe todas as aulas das turmas em que o aluno está matriculado
 * O aluno pode:
 * - Visualizar informações das aulas
 * - Marcar sua presença
 * 
 * O aluno NÃO pode:
 * - Editar informações das aulas
 * - Deletar aulas
 * - Marcar presença de outros alunos
 * 
 * Route: /usuario/aulas
 */
export default function StudentAulasPage() {
  const { user } = useAuth();
  const { data: classes, isLoading: isLoadingClasses } = useStudentClasses();
  const { data: allLessons, isLoading: isLoadingLessons } = useLessons();
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Debounce para a busca - espera 500ms após parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Obter todas as aulas das turmas do aluno (SEM FILTRO) para cálculo de numeração
  const studentLessonsUnfiltered = useMemo(() => {
    if (!allLessons || !classes) return [];
    
    // Garantir que allLessons é um array
    const lessonsArray = Array.isArray(allLessons) ? allLessons : [];
    
    const classIds = new Set(classes.map(c => c.id));
    let filtered = lessonsArray.filter(lesson => classIds.has(lesson.classId));
    
    // Se uma turma específica foi selecionada, filtrar por ela também
    // para que a numeração seja consistente dentro da turma
    if (selectedClassId) {
      filtered = filtered.filter(lesson => lesson.classId === selectedClassId);
    }
    
    return filtered;
  }, [allLessons, classes, selectedClassId]);

  // Filtrar aulas com base nos filtros selecionados (status, busca)
  const studentLessons = useMemo(() => {
    let filtered = [...studentLessonsUnfiltered];
    
    // Filtrar por status (agendadas/realizadas) usando função utilitária
    filtered = filterLessonsByStatus(filtered, filterStatus);
    
    // Filtrar por busca (nome da aula ou descrição)
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase();
      
      filtered = filtered.filter(lesson => {
        const matchName = lesson.name?.toLowerCase().includes(search);
        const matchDescription = lesson.description?.toLowerCase().includes(search);
        const matchClass = lesson.class?.code?.toLowerCase().includes(search);
        const matchSubject = lesson.class?.subject?.name?.toLowerCase().includes(search);
        
        return matchName || matchDescription || matchClass || matchSubject;
      });
    }
    
    // Ordenar por data - ordem cronológica (crescente - mais antiga primeiro)
    // A ordenação é consistente independente do filtro selecionado
    return filtered.sort((a, b) => compareLessonsByTime(a, b, true));
  }, [studentLessonsUnfiltered, debouncedSearchTerm, filterStatus]);

  const isLoading = isLoadingClasses || isLoadingLessons;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiClipboard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Minhas Aulas
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Aulas de todas as suas turmas
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        {/* Campo de Busca */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição da aula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtro por Turma */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Filtrar por Turma:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedClassId(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedClassId === null
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
              }`}
            >
              Todas ({allLessons?.filter(l => classes?.some(c => c.id === l.classId)).length || 0})
            </button>
            {classes?.map((classItem) => {
              const lessonsCount = allLessons?.filter(l => l.classId === classItem.id).length || 0;
              return (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClassId(classItem.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedClassId === classItem.id
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
                  }`}
                >
                  {classItem.code} ({lessonsCount})
                </button>
              );
            })}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-premium h-40 w-full" />
            ))}
          </div>
        ) : studentLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              Tente ajustar os filtros ou a pesquisa
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

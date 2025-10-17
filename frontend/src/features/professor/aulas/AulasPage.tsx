import { FiClipboard, FiSearch, FiX } from 'react-icons/fi';
import { useProfessorClasses } from '@/hooks/useProfessorClasses';
import { useLessons } from '@/hooks/useLessons';
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LessonCard } from '@/components/lessons/LessonCard';
import { LessonDetailModal } from '@/components/professor/LessonDetailModal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';

export default function ProfessorAulasPage() {
  const { data: classes, isLoading: isLoadingClasses } = useProfessorClasses();
  const { data: allLessons, isLoading: isLoadingLessons } = useLessons();
  const [sortBy, setSortBy] = useState<'recent' | 'upcoming'>('upcoming');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const [lessonDetailModalData, setLessonDetailModalData] = useState<{
    lessonId: number;
    classId: number;
    className: string;
  } | null>(null);

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

  // Debounce para a busca - espera 500ms após parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtrar aulas pelas turmas do professor
  const professorLessons = useMemo(() => {
    if (!allLessons || !classes) return [];
    
    // DEBUG: Ver estrutura das aulas
    if (allLessons.length > 0) {
      console.log('🔍 Exemplo de aula:', allLessons[0]);
      console.log('🔍 Class:', allLessons[0].class);
      console.log('🔍 Subject:', allLessons[0].class?.subject);
    }
    
    const classIds = new Set(classes.map(c => c.id));
    let filtered = allLessons.filter(lesson => classIds.has(lesson.classId));
    
    // Filtrar por busca (nome da aula ou descrição)
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase();
      console.log('🔍 Buscando por:', search);
      
      const beforeCount = filtered.length;
      filtered = filtered.filter(lesson => {
        const matchName = lesson.name?.toLowerCase().includes(search);
        const matchDescription = lesson.description?.toLowerCase().includes(search);
        const matchClass = lesson.class?.code?.toLowerCase().includes(search);
        const matchSubject = lesson.class?.subject?.name?.toLowerCase().includes(search);
        
        const hasMatch = matchName || matchDescription || matchClass || matchSubject;
        
        if (hasMatch) {
          console.log('✅ Match encontrado:', lesson.name || 'Sem nome', '- Disciplina:', lesson.class?.subject?.name);
        }
        
        return hasMatch;
      });
      console.log(`🔍 Resultados: ${filtered.length} de ${beforeCount} aulas`);
    }
    
    // Filtrar por turma selecionada
    if (selectedClassId) {
      filtered = filtered.filter(lesson => lesson.classId === selectedClassId);
    }
    
    // Ordenar por data
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      
      if (sortBy === 'upcoming') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, [allLessons, classes, sortBy, selectedClassId, debouncedSearchTerm]);

  const isLoading = isLoadingClasses || isLoadingLessons;

  const handleEditLesson = (lessonId: number) => {
    // Encontrar a aula e abrir o modal de detalhes
    const lesson = allLessons?.find(l => l.id === lessonId);
    if (lesson) {
      setLessonDetailModalData({
        lessonId,
        classId: lesson.classId,
        className: `${lesson.class?.code} - ${lesson.class?.subject?.name}`,
      });
    }
  };

  const handleDeleteLesson = (lessonId: number) => {
    const lesson = allLessons?.find(l => l.id === lessonId);
    if (lesson) {
      setDeleteConfirmation({
        isOpen: true,
        lessonId,
        lessonName: lesson.name || 'Aula',
        isLoading: false,
      });
    }
  };

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
        await queryClient.refetchQueries({ queryKey: ['lessons'] });
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
      {/* Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <FiClipboard className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
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
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6">
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
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Lista de Aulas
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
              }`}
            >
              Recentes
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-premium h-24 w-full" />
            ))}
          </div>
        ) : professorLessons && professorLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {professorLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                onView={() => {
                  // Link para a turma da aula
                  window.location.href = `/professor/turmas/${lesson.classId}`;
                }}
                onEdit={handleEditLesson}
                onDelete={handleDeleteLesson}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <FiClipboard size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">Nenhuma aula encontrada</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Crie aulas em suas turmas para vê-las aqui
            </p>
          </div>
        )}
      </div>

      {/* Lesson Detail Modal */}
      {lessonDetailModalData && (
        <LessonDetailModal
          isOpen={true}
          lessonId={lessonDetailModalData.lessonId}
          classId={lessonDetailModalData.classId}
          className={lessonDetailModalData.className}
          onClose={() => setLessonDetailModalData(null)}
          onUpdate={async () => {
            await queryClient.invalidateQueries({ queryKey: ['lessons'] });
            await queryClient.refetchQueries({ queryKey: ['lessons'] });
          }}
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

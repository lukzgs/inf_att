import { useState, useMemo, useEffect } from 'react';
import { FiAward, FiSearch, FiX } from 'react-icons/fi';
import { useProfessorStudents, useProfessorStudentAttendance } from '@/hooks/useUsers';
import { useProfessorClasses } from '@/hooks/useProfessorClasses';
import { ListPageSkeleton } from '@/components/common/Skeleton';
import { EmptyListState, ErrorState } from '@/components/common/EmptyState';
import { StudentDetailModal } from '@/components/professor/StudentDetailModal';
import { formatAulaTitle } from '@/utils/lessons/getAulaNumber';
import { api } from '@/services/api';

export default function AlunosListPage() {
  const { data: students, isLoading, isError, error, refetch } = useProfessorStudents();
  const { data: professorClasses } = useProfessorClasses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<Array<{ id: number; date: string }>>([]);

  // Hook para buscar presença do aluno selecionado
  const { data: attendanceData } = useProfessorStudentAttendance(
    selectedStudent?.id || 0
  );

  // Buscar todas as aulas para cálculo de numeração dinâmica
  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const response = await api.get('/aulas?skip=0&take=1000');
        setAllLessons(response.data || []);
      } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        setAllLessons([]);
      }
    };

    fetchAllLessons();
  }, []);

  // Calcular estatísticas quando dados de presença chegam
  useEffect(() => {
    if (attendanceData && selectedStudent) {
      const totalLessons = attendanceData.length;
      const totalPresent = attendanceData.filter((a) => a.isPresent).length;
      const totalAbsent = totalLessons - totalPresent;
      const frequency = totalLessons > 0 ? ((totalPresent / totalLessons) * 100).toFixed(1) : '0';

      setStudentStats({
        totalLessons,
        totalPresent,
        totalAbsent,
        frequency: parseFloat(frequency as string),
      });
    }
  }, [attendanceData, selectedStudent]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleOpenStudentModal = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Obter students de uma classe específica
  const getStudentsFromClass = useMemo(() => {
    if (!selectedClassId || !Array.isArray(professorClasses)) {
      return students || [];
    }
    
    const selectedClass = professorClasses.find(c => c.id === selectedClassId);
    if (!selectedClass) return [];
    
    const classStudentIds = new Set();
    const classUsers = selectedClass.users || [];
    classUsers.forEach((uc: any) => {
      if (uc.user?.id) {
        classStudentIds.add(uc.user.id);
      }
    });
    
    return (students || []).filter(s => classStudentIds.has(s.id));
  }, [students, professorClasses, selectedClassId]);

  // Filtro de busca e turma - DEVE VIR ANTES DOS RETURNS
  const filteredStudents = useMemo(() => {
    return getStudentsFromClass.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.uniqueIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [getStudentsFromClass, searchTerm]);

  // Contar estatísticas - DEVE VIR ANTES DOS RETURNS
  const totalStudents = students?.length || 0;

  // AGORA SIM, FAZEMOS OS RETURNS
  if (isLoading) {
    return <ListPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState 
        message={error?.message} 
        onRetry={() => refetch()}
      />
    );
  }

  if (filteredStudents.length === 0 && searchTerm === '') {
    return (
      <EmptyListState
        entityName="aluno"
      />
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiAward className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Meus Alunos
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
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
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
                  ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
              }`}
            >
              Todas ({totalStudents})
            </button>
            {Array.isArray(professorClasses) && professorClasses.map((classItem: any) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClassId(classItem.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedClassId === classItem.id
                    ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-200'
                }`}
              >
                {classItem.subject?.code || 'Turma'} ({classItem.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alunos Card */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2 inline-block">
              Alunos
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              {filteredStudents.length} aluno{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <FiAward size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">Nenhum aluno encontrado</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {searchTerm ? 'Tente ajustar seus critérios de busca' : 'Nenhum aluno disponível'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleOpenStudentModal(student)}
                className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6 text-left"
              >
                {/* Card Header */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 truncate">
                    {student.email}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-base-content/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center flex-shrink-0">
                      <FiAward className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-base-content/70">Matrícula</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {student.uniqueIdentifier}
                      </p>
                    </div>
                  </div>
                  
                  {/* Lupa visível apenas no desktop */}
                  <div className="hidden sm:flex items-center gap-2 justify-end">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-200 dark:ring-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <FiSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && studentStats && (
        <StudentDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseStudentModal}
          name={selectedStudent.name}
          email={selectedStudent.email}
          matricula={selectedStudent.uniqueIdentifier}
          totalLessons={studentStats.totalLessons}
          attendances={studentStats.totalPresent}
          absences={studentStats.totalAbsent}
          attendanceData={attendanceData?.map((record) => ({
            date: record.lesson.date,
            present: record.isPresent,
            lesson: formatAulaTitle(record.lesson, allLessons),
            lessonId: record.lessonId,
            userId: record.userId,
          })) || []}
          onAttendanceUpdate={() => {
            // Refetch attendance data
          }}
        />
      )}
    </div>
  );
}

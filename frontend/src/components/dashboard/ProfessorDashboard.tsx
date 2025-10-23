import { FiUsers, FiBook, FiBarChart2 } from 'react-icons/fi';
import { useProfessorClasses } from '../../hooks/useProfessorClasses';
import { useProfessorStudents } from '../../hooks/useUsers';
import { useMemo } from 'react';

export default function ProfessorDashboard() {
  const { data: classes, isLoading: classesLoading } = useProfessorClasses();
  const { data: students, isLoading: studentsLoading } = useProfessorStudents();

  // Calcular total de aulas
  const totalLessons = useMemo(() => {
    return classes?.reduce((sum, turma) => sum + (turma.lessons?.length || 0), 0) || 0;
  }, [classes]);

  const isLoading = classesLoading || studentsLoading;
  const totalClasses = classes?.length || 0;
  const totalStudents = students?.length || 0;

  return (
    <div className="animate-fade-in-up">
      {/* Compact Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Painel do Professor
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Gerencie suas turmas e aulas
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-12">
        {/* Total de Turmas */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center flex-shrink-0">
              <FiBook className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Total de Turmas</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : totalClasses}
              </p>
            </div>
          </div>
        </div>

        {/* Total de Alunos */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 dark:bg-blue-500/10 ring-2 ring-blue-200 dark:ring-blue-500/30 flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Total de Alunos</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* Total de Aulas */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30 flex items-center justify-center flex-shrink-0">
              <FiBarChart2 className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Total de Aulas</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : totalLessons}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

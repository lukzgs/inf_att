import { FiBook, FiCalendar, FiUsers, FiArrowLeft } from 'react-icons/fi';

interface ClassInfoPanelProps {
  subjectCode: string;
  subjectName: string;
  classCode: string;
  year: number;
  semester: number;
  credits: number;
  totalStudents: number;
  totalLessons: number;
  onBack?: () => void;
}

/**
 * Painel de Informações da Turma
 * 
 * Exibe informações gerais da turma:
 * - Código da disciplina e turma
 * - Nome da disciplina
 * - Ano e semestre
 * - Total de alunos
 * - Total de aulas
 * 
 * Usado na página de detalhes da turma (ClassDetailPage)
 */
export function ClassInfoPanel({
  subjectCode,
  subjectName,
  classCode,
  year,
  semester,
  credits,
  totalStudents,
  totalLessons,
  onBack,
}: ClassInfoPanelProps) {
  return (
    <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
      {/* Header com Ícone e Botão Voltar */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiBook className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {subjectCode} - Turma {classCode}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              {subjectName}
            </p>
          </div>
        </div>

        {/* Botão Voltar */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 sm:p-3 rounded-lg btn-premium hover:sm:scale-105 active:scale-95 transition-transform"
            aria-label="Voltar"
            title="Voltar ao Dashboard"
          >
            <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Créditos */}
        <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <FiBook className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Créditos</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-200">
            {credits}
          </p>
        </div>

        {/* Período */}
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <FiCalendar className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Período</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-green-900 dark:text-green-200">
            {year}/{semester}º
          </p>
        </div>

        {/* Alunos */}
        <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <FiUsers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Alunos</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-purple-900 dark:text-purple-200">
            {totalStudents}
          </p>
        </div>

        {/* Aulas */}
        <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <FiBook className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Aulas</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-orange-900 dark:text-orange-200">
            {totalLessons}
          </p>
        </div>
      </div>
    </div>
  );
}

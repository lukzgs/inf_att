import { FiArrowLeft, FiMail, FiCheck, FiX, FiBook, FiUser } from 'react-icons/fi';

interface StudentInfoPanelProps {
  name: string;
  email: string;
  matricula: string;
  totalLessons: number;
  attendances: number;
  absences: number;
  onBack?: () => void;
}

/**
 * Painel de Informações do Aluno
 * 
 * Exibe informações gerais do aluno em layout similar ao modal de edição de aula:
 * - Nome e email no header
 * - Card com informações em formato display (não editável)
 * 
 * Usado na página de detalhes do aluno (AlunoDetailPage)
 */
export function StudentInfoPanel({
  name,
  email,
  matricula,
  totalLessons,
  attendances,
  absences,
  onBack,
}: StudentInfoPanelProps) {
  return (
    <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
      {/* Header Card */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl sm:text-3xl flex items-center justify-center flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1 mt-1">
                <FiMail className="w-3.5 h-3.5 flex-shrink-0" />
                {email}
              </p>
            </div>
          </div>

          {/* Botão Voltar */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex-shrink-0 p-2 sm:p-3 rounded-lg bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 active:scale-95 transition-all"
              aria-label="Voltar"
              title="Voltar"
            >
              <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Informações do Aluno - Modal Style */}
      <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">Informações do Aluno</h4>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Matrícula */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="text-xs font-bold">ID</span>
                Matrícula
              </span>
            </label>
            <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
              <p className="text-gray-900 dark:text-white text-sm font-semibold">
                {matricula}
              </p>
            </div>
          </div>

          {/* Total de Aulas */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <FiBook className="w-3.5 h-3.5" />
                Total de Aulas
              </span>
            </label>
            <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
              <p className="text-gray-900 dark:text-white text-sm font-semibold">
                {totalLessons}
              </p>
            </div>
          </div>

          {/* Grid: Presenças e Faltas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Presenças */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <FiCheck className="w-3.5 h-3.5" />
                  Presenças
                </span>
              </label>
              <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                <p className="text-emerald-900 dark:text-emerald-200 text-sm font-bold">
                  {attendances}
                </p>
              </div>
            </div>

            {/* Faltas */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <FiX className="w-3.5 h-3.5" />
                  Faltas
                </span>
              </label>
              <div className="flex-1 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg border border-red-200 dark:border-red-500/30">
                <p className="text-red-900 dark:text-red-200 text-sm font-bold">
                  {absences}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

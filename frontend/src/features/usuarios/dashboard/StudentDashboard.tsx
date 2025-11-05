import { FiBook, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useStudentClasses, useStudentOverallStats } from '@/hooks/useStudentClasses';
import { PresenceRegistrationModal } from '../attendance/PresenceRegistrationModal';
import { LowFrequencyAlert } from './LowFrequencyAlert';
import { formatPercentage } from '@/utils/format/formatPercentage';

export default function StudentDashboard() {
  const { data: classes, isLoading } = useStudentClasses();
  const { totalClasses, overallPercentage } = useStudentOverallStats();
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="premium-card-wrapper">
          <div className="premium-card">
            <div className="premium-card-body">
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Compact Header - Similar ao Professor */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiBook className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Painel do Aluno
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Acompanhe suas disciplinas e frequência
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Similar ao Professor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Disciplinas Cursadas */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center flex-shrink-0">
              <FiBook className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Disciplinas Cursadas</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {totalClasses}
              </p>
            </div>
          </div>
        </div>

        {/* Frequência Geral */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-100 dark:bg-green-500/10 ring-2 ring-green-200 dark:ring-green-500/30 flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Frequência Geral</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(overallPercentage)}
              </p>
            </div>
          </div>
        </div>

        {/* Disciplinas com Atenção */}
        <div className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 font-medium">Disciplinas com Atenção</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {classes?.filter(c => c.frequencyStatus === 'warning' || c.frequencyStatus === 'error').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Frequency Alert */}
      {classes && classes.length > 0 && (
        <LowFrequencyAlert 
          classes={classes.filter(c => c.attendancePercentage < 80)} 
        />
      )}

      {/* Modal de Registro de Presença */}
      <PresenceRegistrationModal
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
      />
    </div>
  );
}

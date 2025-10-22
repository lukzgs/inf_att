import { FiUsers, FiPlus, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useProfessorClasses } from '@/hooks/useProfessorClasses';
import { useState } from 'react';
import { CreateClassModal } from '@/components/dashboard/CreateClassModal';

export default function TurmasPage() {
  const { data: classes, isLoading } = useProfessorClasses();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Minhas Turmas
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Gerencie todas as suas turmas e aulas
            </p>
          </div>
        </div>
      </div>

      {/* Turmas Section */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-base-content/10 pb-2 inline-block">
              Turmas
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              {classes?.length || 0} turma{classes?.length !== 1 ? 's' : ''} lecionada{classes?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-shrink-0 btn-premium gap-2 text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:sm:scale-105 active:scale-95 transition-transform"
          >
            <FiPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Nova Turma</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-premium h-48 w-full" />
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classes.map((turma) => (
              <Link
                key={turma.id}
                to={`/professor/turmas/${turma.id}`}
                className="card-premium group hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 sm:p-6"
              >
                {/* Card Header */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
                    {turma.subject?.code} - Turma {turma.code}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 line-clamp-2 mb-1">
                    {turma.subject?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70">
                    {turma.year}/{turma.semester}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-base-content/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center flex-shrink-0">
                      <FiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-base-content/70">Alunos</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {turma.totalStudents}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30 flex items-center justify-center flex-shrink-0">
                      <FiBook className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-base-content/70">Créditos</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {turma.subject?.credits || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <FiUsers size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">Nenhuma turma encontrada</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
              Crie sua primeira turma para começar
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-premium gap-2"
            >
              <FiPlus size={18} />
              Nova Turma
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateClassModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

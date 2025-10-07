import { FiUsers, FiPlus, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useProfessorClasses } from '../../hooks/useProfessorClasses';
import { useState } from 'react';
import { CreateClassModal } from './CreateClassModal';

export default function ProfessorDashboard() {
  const { data: classes, isLoading } = useProfessorClasses();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Hero Header */}
      <div className="hero-card">
        <div className="hero-card-overlay" />
        <div className="hero-card-content">
          <div className="hero-card-icon">
            <FiUsers />
          </div>
          <h1 className="hero-card-title">
            Painel do Professor
          </h1>
          <p className="hero-card-subtitle">
            Gerencie suas turmas e aulas
          </p>
        </div>
      </div>

      {/* Minhas Turmas */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Minhas Turmas
            </h2>
            <p className="section-subtitle">
              {classes?.length || 0} turma(s) ativa(s)
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-premium"
          >
            <FiPlus className="w-5 h-5" />
            Nova Turma
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-premium h-48 w-full" />
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((turma) => (
              <Link
                key={turma.id}
                to={`/professor/turmas/${turma.id}`}
                className="card-premium group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {/* Card Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
                        {turma.subject?.code} - Turma {turma.code}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-base-content/70 line-clamp-2">
                        {turma.subject?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className="badge-premium badge-premium-primary">
                      {turma.year}/{turma.semester}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-base-content/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FiUsers className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 dark:text-base-content/70">Alunos</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {turma.totalStudents}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <FiBook className="w-4 h-4 text-success" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 dark:text-base-content/70">Créditos</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {turma.subject?.credits || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="empty-state-title">Nenhuma turma encontrada</h3>
            <p className="empty-state-description">
              Você ainda não está lecionando nenhuma turma. Clique em "Nova Turma" para começar!
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-premium mt-4"
            >
              <FiPlus className="w-5 h-5" />
              Criar Primeira Turma
            </button>
          </div>
        )}
      </section>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

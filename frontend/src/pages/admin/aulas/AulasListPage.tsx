import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useLessons } from '../../../hooks/useLessons';
import { api } from '../../../services/api';
import { ListPageSkeleton } from '../../../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../../../components/common/EmptyState';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';
import { LessonCard } from '../../../components/lessons/LessonCard';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';

export default function AulasListPage() {
  const { data: lessons, isLoading, isError, error, refetch } = useLessons();
  const { confirm } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

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

  // Filtros
  const filteredLessons = lessons?.filter(lesson => {
    const matchesSearch = 
      (lesson.name && lesson.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lesson.class?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.class?.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'open' && lesson.isOpen) ||
      (filterStatus === 'closed' && !lesson.isOpen);

    const matchesDate = 
      !filterDate || 
      lesson.date.startsWith(filterDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Formatar data

  return (
    <div className="animate-fade-in-up">
      {/* Compact Header */}
      <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiPlus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Aulas
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Gerencie aulas, horários e registro de presença
            </p>
          </div>
        </div>
      </div>

      {/* Aulas Section */}
      <section>
        <div className="bg-white dark:bg-base-100 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-base-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-0">
              Todas as Aulas
            </h2>
            <Link to="/admin/aulas/novo">
              <button 
                className="btn-premium gap-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3 hover:sm:scale-105 active:scale-95 transition-transform"
              >
                <FiPlus className="w-5 h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Nova Aula</span>
              </button>
            </Link>
          </div>

          {/* Filtros e Busca */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome, turma ou disciplina..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro por Status */}
              <select
                className="select select-bordered w-full md:w-48"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="open">Abertas</option>
                <option value="closed">Fechadas</option>
              </select>

              {/* Filtro por Data */}
              <input
                type="date"
                className="input input-bordered w-full md:w-48"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {/* Contador de resultados */}
            <div className="text-sm text-base-content/60 mt-3">
              {filteredLessons?.length || 0} aula(s) encontrada(s)
            </div>
          </div>

          {/* Grid de Aulas */}
          {!filteredLessons || filteredLessons.length === 0 ? (
            <EmptyListState
              entityName="aula"
              onAdd={() => window.location.href = '/admin/aulas/novo'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {filteredLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isAdmin
              onView={() => window.location.href = `/admin/aulas/${lesson.id}`}
              onEdit={() => window.location.href = `/admin/aulas/${lesson.id}/editar`}
              onDelete={async () => {
                const confirmed = await confirm({
                  title: 'Deletar aula?',
                  description: `Tem certeza que deseja deletar a aula "${lesson.name || 'Sem nome'}"? Esta ação não pode ser desfeita e removerá todas as presenças registradas.`,
                  variant: 'danger',
                  confirmText: 'Deletar',
                  cancelText: 'Cancelar',
                  onConfirm: async () => {
                    await api.delete(`/aulas/${lesson.id}`);
                  },
                });

                if (confirmed) {
                  toast.success('Aula deletada com sucesso!');
                  refetch();
                }
              }}
              onOpen={async () => {
                const confirmed = await confirm({
                  title: 'Abrir aula para registro de presença?',
                  description: `Deseja abrir a aula "${lesson.name || 'Sem nome'}" para que alunos possam registrar presença?`,
                  variant: 'info',
                  confirmText: 'Abrir',
                  cancelText: 'Cancelar',
                  onConfirm: async () => {
                    await api.patch(`/aulas/${lesson.id}/open`, { openedBy: 1 });
                  },
                });

                if (confirmed) {
                  toast.success('Aula aberta com sucesso!');
                  refetch();
                }
              }}
              onClose={async () => {
                const confirmed = await confirm({
                  title: 'Fechar aula?',
                  description: `Deseja fechar a aula "${lesson.name || 'Sem nome'}"? Alunos não poderão mais registrar presença.`,
                  variant: 'warning',
                  confirmText: 'Fechar',
                  cancelText: 'Cancelar',
                  onConfirm: async () => {
                    await api.patch(`/aulas/${lesson.id}/close`);
                  },
                });

                if (confirmed) {
                  toast.success('Aula fechada com sucesso!');
                  refetch();
                }
              }}
              index={index + 1}
            />
          ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

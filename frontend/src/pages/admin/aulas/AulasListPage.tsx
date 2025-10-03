import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useLessons } from '../../../hooks/useLessons';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { ListPageSkeleton } from '../../../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../../../components/common/EmptyState';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';
import { FiEdit2, FiPlus, FiTrash2, FiClock, FiUnlock, FiLock, FiCalendar, FiBook } from 'react-icons/fi';
import { useState } from 'react';

export default function AulasListPage() {
  const { data: lessons, isLoading, isError, error, refetch } = useLessons();
  const { confirmDialog, confirm } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const handleDelete = async (lessonId: number, lessonName: string) => {
    const confirmed = await confirm({
      title: 'Deletar aula?',
      description: `Tem certeza que deseja deletar a aula "${lessonName || 'Sem nome'}"? Esta ação não pode ser desfeita e removerá todas as presenças registradas.`,
      variant: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.delete(`/aulas/${lessonId}`);
      },
    });

    if (confirmed) {
      toast.success('Aula deletada com sucesso!');
      refetch();
    }
  };

  const handleOpenLesson = async (lessonId: number, lessonName: string) => {
    const confirmed = await confirm({
      title: 'Abrir aula para registro de presença?',
      description: `Deseja abrir a aula "${lessonName || 'Sem nome'}" para que alunos possam registrar presença?`,
      variant: 'info',
      confirmText: 'Abrir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        // TODO: Obter userId do contexto de autenticação
        await api.patch(`/aulas/${lessonId}/open`, { openedBy: 1 });
      },
    });

    if (confirmed) {
      toast.success('Aula aberta com sucesso!');
      refetch();
    }
  };

  const handleCloseLesson = async (lessonId: number, lessonName: string) => {
    const confirmed = await confirm({
      title: 'Fechar aula?',
      description: `Deseja fechar a aula "${lessonName || 'Sem nome'}"? Alunos não poderão mais registrar presença.`,
      variant: 'warning',
      confirmText: 'Fechar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.patch(`/aulas/${lessonId}/close`);
      },
    });

    if (confirmed) {
      toast.success('Aula fechada com sucesso!');
      refetch();
    }
  };

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
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  // Formatar hora
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // HH:mm
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Aulas</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Gerencie aulas, horários e registro de presença
          </p>
        </div>
        <Link to="/admin/aulas/novo">
          <Button variant="default" size="md">
            <FiPlus className="w-5 h-5" />
            Nova Aula
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-4">
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
          <div className="text-sm text-base-content/60 mt-2">
            {filteredLessons?.length || 0} aula(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Lista de Aulas */}
      {!filteredLessons || filteredLessons.length === 0 ? (
        <EmptyListState
          entityName="aula"
          onAdd={() => window.location.href = '/admin/aulas/novo'}
        />
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Nome/Turma</th>
                  <th className="text-center">Data</th>
                  <th className="text-center">Horário</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id}>
                    {/* Status */}
                    <td>
                      {lesson.isOpen ? (
                        <div className="badge badge-success gap-1">
                          <FiUnlock className="w-3 h-3" />
                          Aberta
                        </div>
                      ) : (
                        <div className="badge badge-ghost gap-1">
                          <FiLock className="w-3 h-3" />
                          Fechada
                        </div>
                      )}
                    </td>

                    {/* Nome/Turma */}
                    <td>
                      <div className="flex flex-col">
                        <div className="font-medium">
                          {lesson.name || 'Aula sem nome'}
                        </div>
                        <div className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
                          <FiBook className="w-3 h-3" />
                          {lesson.class?.code} - {lesson.class?.subject?.name}
                        </div>
                      </div>
                    </td>

                    {/* Data */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FiCalendar className="w-4 h-4 text-base-content/50" />
                        {formatDate(lesson.date)}
                      </div>
                    </td>

                    {/* Horário */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FiClock className="w-4 h-4 text-base-content/50" />
                        {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                      </div>
                    </td>

                    {/* Ações */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {/* Abrir/Fechar */}
                        {lesson.isOpen ? (
                          <button
                            onClick={() => handleCloseLesson(lesson.id, lesson.name || 'Aula')}
                            className="btn btn-sm btn-warning"
                            title="Fechar aula"
                          >
                            <FiLock />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenLesson(lesson.id, lesson.name || 'Aula')}
                            className="btn btn-sm btn-success"
                            title="Abrir aula"
                          >
                            <FiUnlock />
                          </button>
                        )}

                        {/* Editar */}
                        <Link to={`/admin/aulas/${lesson.id}/editar`}>
                          <button
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                        </Link>

                        {/* Deletar */}
                        <button
                          onClick={() => handleDelete(lesson.id, lesson.name || 'Aula')}
                          className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                          title="Deletar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmDialog}
    </div>
  );
}

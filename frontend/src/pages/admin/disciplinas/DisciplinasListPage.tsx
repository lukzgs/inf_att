import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubjects } from '../../../hooks/useSubjects';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { ListPageSkeleton } from '../../../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../../../components/common/EmptyState';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';
import { FiEdit2, FiPlus, FiTrash2, FiBook } from 'react-icons/fi';
import { useState } from 'react';

export default function DisciplinasListPage() {
  const { data: subjects, isLoading, isError, error, refetch } = useSubjects();
  const { confirmDialog, confirm } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleDelete = async (subjectId: number, subjectName: string) => {
    const confirmed = await confirm({
      title: 'Deletar disciplina?',
      description: `Tem certeza que deseja deletar a disciplina "${subjectName}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.delete(`/disciplinas/${subjectId}`);
      },
    });

    if (confirmed) {
      toast.success('Disciplina deletada com sucesso!');
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
  const filteredSubjects = subjects?.filter(subject => {
    const matchesSearch = 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      filterType === 'all' || 
      subject.type === filterType;

    return matchesSearch && matchesType;
  });

  // Função para traduzir tipo
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'THEORETICAL':
        return 'Teórica';
      case 'PRACTICAL':
        return 'Prática';
      case 'THEORETICAL_PRACTICAL':
        return 'Teórico-Prática';
      default:
        return type;
    }
  };

  // Função para cor do badge de tipo
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'THEORETICAL':
        return 'badge-info';
      case 'PRACTICAL':
        return 'badge-warning';
      case 'THEORETICAL_PRACTICAL':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Disciplinas</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Gerencie disciplinas, códigos e cargas horárias
          </p>
        </div>
        <Link to="/admin/disciplinas/novo">
          <Button variant="default" size="md">
            <FiPlus className="w-5 h-5" />
            Nova Disciplina
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
                placeholder="Buscar por código ou nome..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por Tipo */}
            <select
              className="select select-bordered w-full md:w-64"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              <option value="THEORETICAL">Teóricas</option>
              <option value="PRACTICAL">Práticas</option>
              <option value="THEORETICAL_PRACTICAL">Teórico-Práticas</option>
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-base-content/60 mt-2">
            {filteredSubjects?.length || 0} disciplina(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Lista de Disciplinas */}
      {!filteredSubjects || filteredSubjects.length === 0 ? (
        <EmptyListState
          entityName="disciplina"
          onAdd={() => window.location.href = '/admin/disciplinas/novo'}
        />
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th className="text-center">Créditos</th>
                  <th className="text-center">Carga Horária</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id}>
                    {/* Código */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FiBook className="w-4 h-4 text-base-content/50" />
                        <span className="font-mono font-medium">
                          {subject.code}
                        </span>
                      </div>
                    </td>

                    {/* Nome */}
                    <td>
                      <div className="font-medium">{subject.name}</div>
                    </td>

                    {/* Tipo */}
                    <td>
                      <span className={`badge ${getTypeBadgeClass(subject.type)}`}>
                        {getTypeLabel(subject.type)}
                      </span>
                    </td>

                    {/* Créditos */}
                    <td className="text-center">
                      <span className="font-semibold">{subject.credits}</span>
                    </td>

                    {/* Carga Horária */}
                    <td className="text-center">
                      <span className="text-base-content/70">
                        {subject.workload}h
                      </span>
                    </td>

                    {/* Ações */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {/* Editar */}
                        <Link to={`/admin/disciplinas/${subject.id}/editar`}>
                          <button
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                        </Link>

                        {/* Deletar */}
                        <button
                          onClick={() => handleDelete(subject.id, subject.name)}
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

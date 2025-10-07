import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useClasses } from '../../../hooks/useClasses';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { ListPageSkeleton } from '../../../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../../../components/common/EmptyState';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';
import { FiEdit2, FiPlus, FiTrash2, FiCalendar, FiUsers, FiBook } from 'react-icons/fi';
import { useState } from 'react';

export default function TurmasListPage() {
  const { data: classes, isLoading, isError, error, refetch } = useClasses();
  const { confirmDialog, confirm } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  const handleDelete = async (classId: number, classCode: string) => {
    const confirmed = await confirm({
      title: 'Deletar turma?',
      description: `Tem certeza que deseja deletar a turma "${classCode}"? Esta ação não pode ser desfeita e removerá todas as aulas e presenças associadas.`,
      variant: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.delete(`/turmas/${classId}`);
      },
    });

    if (confirmed) {
      toast.success('Turma deletada com sucesso!');
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

  // Obter anos únicos para filtro
  const uniqueYears = Array.from(new Set(classes?.map(c => c.year) || [])).sort((a, b) => b - a);

  // Filtros
  const filteredClasses = classes?.filter(classItem => {
    const matchesSearch = 
      classItem.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject?.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester = 
      filterSemester === 'all' || 
      classItem.semester.toString() === filterSemester;

    const matchesYear = 
      filterYear === 'all' || 
      classItem.year.toString() === filterYear;

    return matchesSearch && matchesSemester && matchesYear;
  });

  // Contar professores e alunos
  const countTeachers = (users?: any[]) => {
    return users?.filter(u => u.role === 'TEACHER').length || 0;
  };

  const countStudents = (users?: any[]) => {
    return users?.filter(u => u.role === 'STUDENT').length || 0;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Turmas</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Gerencie turmas, professores e alunos
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/turmas/wizard">
            <Button variant="accent" size="md">
              <FiPlus className="w-5 h-5" />
              Wizard
            </Button>
          </Link>
          <Link to="/admin/turmas/novo">
            <Button variant="default" size="md">
              <FiPlus className="w-5 h-5" />
              Nova Turma
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por código, disciplina..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por Semestre */}
            <select
              className="select select-bordered w-full md:w-40"
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
            >
              <option value="all">Todos semestres</option>
              <option value="1">1º Semestre</option>
              <option value="2">2º Semestre</option>
            </select>

            {/* Filtro por Ano */}
            <select
              className="select select-bordered w-full md:w-40"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">Todos os anos</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-base-content/60 mt-2">
            {filteredClasses?.length || 0} turma(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Lista de Turmas */}
      {!filteredClasses || filteredClasses.length === 0 ? (
        <EmptyListState
          entityName="turma"
          onAdd={() => window.location.href = '/admin/turmas/novo'}
        />
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Disciplina</th>
                  <th className="text-center">Período</th>
                  <th className="text-center">Professores</th>
                  <th className="text-center">Alunos</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    {/* Código */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-base-content/50" />
                        <span className="font-mono font-medium">
                          {classItem.code}
                        </span>
                      </div>
                    </td>

                    {/* Disciplina */}
                    <td>
                      <div className="flex flex-col">
                        <div className="font-medium">{classItem.subject?.name}</div>
                        <div className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
                          <FiBook className="w-3 h-3" />
                          {classItem.subject?.code}
                        </div>
                      </div>
                    </td>

                    {/* Período */}
                    <td className="text-center">
                      <div className="badge badge-outline">
                        {classItem.year}/{classItem.semester}
                      </div>
                    </td>

                    {/* Professores */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiUsers className="w-4 h-4 text-warning" />
                        <span className="font-semibold text-warning">
                          {countTeachers(classItem.users)}
                        </span>
                      </div>
                    </td>

                    {/* Alunos */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiUsers className="w-4 h-4 text-info" />
                        <span className="font-semibold text-info">
                          {countStudents(classItem.users)}
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {/* Editar */}
                        <Link to={`/admin/turmas/${classItem.id}/editar`}>
                          <button
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                        </Link>

                        {/* Deletar */}
                        <button
                          onClick={() => handleDelete(classItem.id, classItem.code)}
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

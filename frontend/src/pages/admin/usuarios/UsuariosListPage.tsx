import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsers } from '../../../hooks/useUsers';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { ListPageSkeleton } from '../../../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../../../components/common/EmptyState';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';
import { FiEdit2, FiPlus, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useState } from 'react';

export default function UsuariosListPage() {
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const { confirmDialog, confirm } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleDelete = async (userId: number, userName: string) => {
    const confirmed = await confirm({
      title: 'Deletar usuário?',
      description: `Tem certeza que deseja deletar o usuário "${userName}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.delete(`/usuarios/${userId}`);
      },
    });

    if (confirmed) {
      toast.success('Usuário deletado com sucesso!');
      refetch();
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean, userName: string) => {
    const action = currentStatus ? 'desativar' : 'ativar';
    const confirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} usuário?`,
      description: `Tem certeza que deseja ${action} o usuário "${userName}"?`,
      variant: currentStatus ? 'warning' : 'info',
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.patch(`/usuarios/${userId}`, { isActive: !currentStatus });
      },
    });

    if (confirmed) {
      toast.success(`Usuário ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
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
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uniqueIdentifier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = 
      filterRole === 'all' || 
      user.roles?.some(ur => ur.role.name === filterRole);

    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Usuários</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Gerencie usuários, roles e permissões
          </p>
        </div>
        <Link to="/admin/usuarios/novo">
          <Button variant="default" size="md">
            <FiPlus className="w-5 h-5" />
            Novo Usuário
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
                placeholder="Buscar por nome, email ou matrícula..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por Role */}
            <select
              className="select select-bordered w-full md:w-48"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Todas as roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PROFESSOR">Professor</option>
              <option value="USER">Aluno</option>
            </select>

            {/* Filtro por Status */}
            <select
              className="select select-bordered w-full md:w-48"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-base-content/60 mt-2">
            {filteredUsers?.length || 0} usuário(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      {!filteredUsers || filteredUsers.length === 0 ? (
        <EmptyListState
          entityName="usuário"
          onAdd={() => window.location.href = '/admin/usuarios/novo'}
        />
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Matrícula</th>
                  <th>Roles</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    {/* Status */}
                    <td>
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <div className="badge badge-success gap-1">
                            <FiUserCheck className="w-3 h-3" />
                            Ativo
                          </div>
                        ) : (
                          <div className="badge badge-error gap-1">
                            <FiUserX className="w-3 h-3" />
                            Inativo
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Nome */}
                    <td>
                      <div className="font-medium">{user.name}</div>
                    </td>

                    {/* Email */}
                    <td>
                      <div className="text-sm text-base-content/70">
                        {user.email}
                      </div>
                    </td>

                    {/* Matrícula */}
                    <td>
                      <div className="font-mono text-sm">
                        {user.uniqueIdentifier}
                      </div>
                    </td>

                    {/* Roles */}
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((ur) => (
                            <span
                              key={ur.roleId}
                              className={`badge badge-sm ${
                                ur.role.name === 'ADMIN'
                                  ? 'badge-error'
                                  : ur.role.name === 'PROFESSOR'
                                  ? 'badge-warning'
                                  : 'badge-info'
                              }`}
                            >
                              {ur.role.name === 'USER' ? 'Aluno' : ur.role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-base-content/50">
                            Sem roles
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Ações */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {/* Ativar/Desativar */}
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive, user.name)}
                          className={`btn btn-sm ${
                            user.isActive ? 'btn-warning' : 'btn-success'
                          }`}
                          title={user.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                        </button>

                        {/* Editar */}
                        <Link to={`/admin/usuarios/${user.id}/editar`}>
                          <button
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                        </Link>

                        {/* Deletar */}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
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

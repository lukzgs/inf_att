import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useClass, type ClassRole } from '../../../hooks/useClasses';
import { useSubjects } from '../../../hooks/useSubjects';
import { useUsers } from '../../../hooks/useUsers';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { FiSave, FiX, FiCalendar, FiHash, FiBook, FiUser, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface ClassFormData {
  code: string;
  year: number;
  semester: number;
  subjectId: number;
}

interface UserClassItem {
  userId: number;
  role: ClassRole;
  userName?: string;
  userEmail?: string;
}

export default function TurmaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [classUsers, setClassUsers] = useState<UserClassItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ClassRole>('STUDENT');

  // Buscar dados da turma (modo edição)
  const { data: classData, isLoading: isLoadingClass } = useClass(id ? parseInt(id) : 0);

  // Buscar disciplinas disponíveis
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();

  // Buscar usuários disponíveis
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClassFormData>({
    defaultValues: {
      code: '',
      year: new Date().getFullYear(),
      semester: 1,
      subjectId: 0,
    },
  });

  // Preencher form com dados existentes (modo edição)
  useEffect(() => {
    if (classData && isEditMode) {
      reset({
        code: classData.code,
        year: classData.year,
        semester: classData.semester,
        subjectId: classData.subjectId,
      });
      
      // Preencher usuários da turma
      if (classData.users) {
        const mappedUsers = classData.users.map(uc => ({
          userId: uc.userId,
          role: uc.role,
          userName: uc.user?.name,
          userEmail: uc.user?.email,
        }));
        setClassUsers(mappedUsers);
      }
    }
  }, [classData, isEditMode, reset]);

  // Mutation para criar/atualizar turma
  const mutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      if (isEditMode) {
        return await api.patch(`/turmas/${id}`, data);
      } else {
        return await api.post('/turmas', data);
      }
    },
    onSuccess: async (response) => {
      const turmaId = isEditMode ? id : response.data.id;
      
      // Atualizar usuários da turma
      if (turmaId) {
        try {
          // Adicionar usuários
          for (const userClass of classUsers) {
            await api.post(`/turmas/${turmaId}/usuarios`, {
              userId: userClass.userId,
              role: userClass.role,
            });
          }
        } catch (error) {
          console.error('Erro ao atualizar usuários:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success(`Turma ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
      navigate('/admin/turmas');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Erro ao salvar turma';
      toast.error(message);
    },
  });

  const onSubmit = (data: ClassFormData) => {
    mutation.mutate(data);
  };

  // Adicionar usuário à turma
  const handleAddUser = () => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário');
      return;
    }

    const userId = parseInt(selectedUserId);
    const user = users?.find(u => u.id === userId);

    // Verificar se já existe
    if (classUsers.some(cu => cu.userId === userId)) {
      toast.error('Usuário já adicionado à turma');
      return;
    }

    setClassUsers([...classUsers, {
      userId,
      role: selectedRole,
      userName: user?.name,
      userEmail: user?.email,
    }]);

    setSelectedUserId('');
    toast.success('Usuário adicionado');
  };

  // Remover usuário da turma
  const handleRemoveUser = (userId: number) => {
    setClassUsers(classUsers.filter(cu => cu.userId !== userId));
    toast.success('Usuário removido');
  };

  // Função para traduzir role
  const getRoleLabel = (role: ClassRole) => {
    switch (role) {
      case 'TEACHER':
        return 'Professor';
      case 'STUDENT':
        return 'Aluno';
      case 'ASSISTANT':
        return 'Monitor';
      default:
        return role;
    }
  };

  // Função para cor do badge de role
  const getRoleBadgeClass = (role: ClassRole) => {
    switch (role) {
      case 'TEACHER':
        return 'badge-warning';
      case 'STUDENT':
        return 'badge-info';
      case 'ASSISTANT':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  };

  const isLoading = isLoadingClass || isLoadingSubjects || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Editar Turma' : 'Nova Turma'}
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {isEditMode
            ? 'Atualize as informações da turma'
            : 'Preencha os dados para criar uma nova turma'}
        </p>
      </div>

      {/* Form */}
      <div className="card bg-base-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>

            {/* Código */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiHash className="inline w-4 h-4 mr-1" />
                  Código da Turma
                </span>
              </label>
              <input
                type="text"
                placeholder="ex: TURMA-2024-1-INF101"
                className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
                {...register('code', {
                  required: 'Código é obrigatório',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                })}
              />
              {errors.code && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.code.message}
                  </span>
                </label>
              )}
            </div>

            {/* Disciplina */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiBook className="inline w-4 h-4 mr-1" />
                  Disciplina
                </span>
              </label>
              <select
                className={`select select-bordered ${errors.subjectId ? 'select-error' : ''}`}
                {...register('subjectId', {
                  required: 'Disciplina é obrigatória',
                  valueAsNumber: true,
                  validate: (value) => value > 0 || 'Selecione uma disciplina',
                })}
              >
                <option value={0}>Selecione uma disciplina</option>
                {subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.subjectId.message}
                  </span>
                </label>
              )}
            </div>

            {/* Ano e Semestre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ano */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <FiCalendar className="inline w-4 h-4 mr-1" />
                    Ano
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="ex: 2024"
                  min="2020"
                  max="2030"
                  className={`input input-bordered ${errors.year ? 'input-error' : ''}`}
                  {...register('year', {
                    required: 'Ano é obrigatório',
                    valueAsNumber: true,
                    min: { value: 2020, message: 'Ano mínimo: 2020' },
                    max: { value: 2030, message: 'Ano máximo: 2030' },
                  })}
                />
                {errors.year && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.year.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Semestre */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Semestre</span>
                </label>
                <select
                  className={`select select-bordered ${errors.semester ? 'select-error' : ''}`}
                  {...register('semester', {
                    required: 'Semestre é obrigatório',
                    valueAsNumber: true,
                  })}
                >
                  <option value={1}>1º Semestre</option>
                  <option value={2}>2º Semestre</option>
                </select>
                {errors.semester && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.semester.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Usuários da Turma */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Professores e Alunos</h3>

            {/* Adicionar Usuário */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    className="select select-bordered flex-1"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Selecione um usuário</option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select select-bordered w-full md:w-48"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as ClassRole)}
                  >
                    <option value="STUDENT">Aluno</option>
                    <option value="TEACHER">Professor</option>
                    <option value="ASSISTANT">Monitor</option>
                  </select>

                  <Button
                    type="button"
                    variant="default"
                    size="md"
                    onClick={handleAddUser}
                  >
                    <FiUserPlus className="w-5 h-5" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Usuários */}
            {classUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Função</th>
                      <th className="text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classUsers.map((userClass) => (
                      <tr key={userClass.userId}>
                        <td>
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-base-content/50" />
                            {userClass.userName}
                          </div>
                        </td>
                        <td className="text-sm text-base-content/70">
                          {userClass.userEmail}
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getRoleBadgeClass(userClass.role)}`}>
                            {getRoleLabel(userClass.role)}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(userClass.userId)}
                            className="btn btn-xs btn-ghost text-error"
                            title="Remover"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                <FiUser className="w-5 h-5" />
                <span className="text-sm">
                  Nenhum usuário adicionado ainda. Adicione professores e alunos à turma.
                </span>
              </div>
            )}

            {/* Resumo */}
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Professores</div>
                <div className="stat-value text-warning">
                  {classUsers.filter(u => u.role === 'TEACHER').length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Alunos</div>
                <div className="stat-value text-info">
                  {classUsers.filter(u => u.role === 'STUDENT').length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Monitores</div>
                <div className="stat-value text-success">
                  {classUsers.filter(u => u.role === 'ASSISTANT').length}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              type="submit"
              variant="default"
              size="md"
              disabled={isSubmitting || mutation.isPending}
              className="flex-1"
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  {isEditMode ? 'Atualizar' : 'Criar'} Turma
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/admin/turmas')}
              disabled={isSubmitting || mutation.isPending}
              className="flex-1"
            >
              <FiX className="w-5 h-5" />
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

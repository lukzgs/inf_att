import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUser } from '../../../hooks/useUsers';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { FiSave, FiX, FiUser, FiMail, FiLock, FiHash } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface UserFormData {
  uniqueIdentifier: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  curriculumId?: number;
  roleIds: number[];
}

interface Role {
  id: number;
  name: string;
}

interface Curriculum {
  id: number;
  name: string;
  courseId: number;
  course: {
    name: string;
  };
}

const fetchRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>('/cargo');
  return response.data;
};

const fetchCurriculums = async (): Promise<Curriculum[]> => {
  const response = await api.get<Curriculum[]>('/curriculo');
  return response.data;
};

export default function UsuarioFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // Buscar dados do usuário (modo edição)
  const { data: user, isLoading: isLoadingUser } = useUser(id ? parseInt(id) : 0);

  // Buscar roles disponíveis
  const { data: roles, isLoading: isLoadingRoles } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  // Buscar currículos disponíveis
  const { data: curriculums, isLoading: isLoadingCurriculums } = useQuery<Curriculum[]>({
    queryKey: ['curriculums'],
    queryFn: fetchCurriculums,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      uniqueIdentifier: '',
      name: '',
      email: '',
      password: '',
      isActive: true,
      curriculumId: undefined,
      roleIds: [],
    },
  });

  // Preencher form com dados existentes (modo edição)
  useEffect(() => {
    if (user && isEditMode) {
      reset({
        uniqueIdentifier: user.uniqueIdentifier,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        curriculumId: user.curriculumId || undefined,
        roleIds: user.roles?.map(ur => ur.roleId) || [],
      });
      setSelectedRoles(user.roles?.map(ur => ur.roleId) || []);
    }
  }, [user, isEditMode, reset]);

  // Mutation para criar/atualizar
  const mutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (isEditMode) {
        // Edição: password é opcional
        const { password, ...updateData } = data;
        const payload = password ? data : updateData;
        return await api.patch(`/usuarios/${id}`, payload);
      } else {
        // Criação: password é obrigatório
        return await api.post('/usuarios', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Usuário ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
      navigate('/admin/usuarios');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Erro ao salvar usuário';
      toast.error(message);
    },
  });

  const onSubmit = (data: UserFormData) => {
    // Adicionar roles selecionados
    data.roleIds = selectedRoles;
    mutation.mutate(data);
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const isLoading = isLoadingUser || isLoadingRoles || isLoadingCurriculums;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {isEditMode
            ? 'Atualize as informações do usuário'
            : 'Preencha os dados para criar um novo usuário'}
        </p>
      </div>

      {/* Form */}
      <div className="card bg-base-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>

            {/* Matrícula */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiHash className="inline w-4 h-4 mr-1" />
                  Matrícula/Identificador
                </span>
              </label>
              <input
                type="text"
                placeholder="ex: 20241234567"
                className={`input input-bordered ${errors.uniqueIdentifier ? 'input-error' : ''}`}
                {...register('uniqueIdentifier', {
                  required: 'Matrícula é obrigatória',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                })}
              />
              {errors.uniqueIdentifier && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.uniqueIdentifier.message}
                  </span>
                </label>
              )}
            </div>

            {/* Nome */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiUser className="inline w-4 h-4 mr-1" />
                  Nome Completo
                </span>
              </label>
              <input
                type="text"
                placeholder="ex: João Silva Santos"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...register('name', {
                  required: 'Nome é obrigatório',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiMail className="inline w-4 h-4 mr-1" />
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="ex: joao.silva@exemplo.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            {/* Senha */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiLock className="inline w-4 h-4 mr-1" />
                  Senha {isEditMode && <span className="text-xs text-base-content/60">(deixe em branco para manter)</span>}
                </span>
              </label>
              <input
                type="password"
                placeholder={isEditMode ? "••••••••" : "Mínimo 6 caracteres"}
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: isEditMode ? false : 'Senha é obrigatória',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>
          </div>

          <div className="divider"></div>

          {/* Currículo (opcional) */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Acadêmicas</h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Currículo (Série/Grade)</span>
                <span className="label-text-alt text-base-content/60">Opcional</span>
              </label>
              <select
                className="select select-bordered"
                {...register('curriculumId', {
                  setValueAs: (v) => (v === '' ? undefined : parseInt(v)),
                })}
              >
                <option value="">Nenhum</option>
                {curriculums?.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.course.name} - {curriculum.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divider"></div>

          {/* Roles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Permissões (Roles)</h3>
            <p className="text-sm text-base-content/60">
              Selecione as funções do usuário no sistema
            </p>

            <div className="flex flex-wrap gap-3">
              {roles?.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                  <span
                    className={`badge badge-lg ${
                      role.name === 'ADMIN'
                        ? 'badge-error'
                        : role.name === 'PROFESSOR'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                  >
                    {role.name === 'USER' ? 'Aluno' : role.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Status</h3>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  {...register('isActive')}
                />
                <div>
                  <span className="label-text font-medium">Usuário Ativo</span>
                  <p className="text-xs text-base-content/60 mt-1">
                    Desative para impedir o acesso sem deletar o usuário
                  </p>
                </div>
              </label>
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
                  {isEditMode ? 'Atualizar' : 'Criar'} Usuário
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/admin/usuarios')}
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

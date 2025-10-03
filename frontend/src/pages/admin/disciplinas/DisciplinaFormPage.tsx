import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSubject, type SubjectType } from '../../../hooks/useSubjects';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { FiSave, FiX, FiBook, FiHash, FiType, FiAward, FiClock } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface SubjectFormData {
  code: string;
  name: string;
  type: SubjectType;
  credits: number;
  workload: number;
}

export default function DisciplinaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Buscar dados da disciplina (modo edição)
  const { data: subject, isLoading: isLoadingSubject } = useSubject(id ? parseInt(id) : 0);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubjectFormData>({
    defaultValues: {
      code: '',
      name: '',
      type: 'THEORETICAL',
      credits: 4,
      workload: 60,
    },
  });

  // Preencher form com dados existentes (modo edição)
  useEffect(() => {
    if (subject && isEditMode) {
      reset({
        code: subject.code,
        name: subject.name,
        type: subject.type,
        credits: subject.credits,
        workload: subject.workload,
      });
    }
  }, [subject, isEditMode, reset]);

  // Mutation para criar/atualizar
  const mutation = useMutation({
    mutationFn: async (data: SubjectFormData) => {
      if (isEditMode) {
        return await api.patch(`/disciplinas/${id}`, data);
      } else {
        return await api.post('/disciplinas', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success(`Disciplina ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
      navigate('/admin/disciplinas');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Erro ao salvar disciplina';
      toast.error(message);
    },
  });

  const onSubmit = (data: SubjectFormData) => {
    mutation.mutate(data);
  };

  if (isLoadingSubject) {
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
          {isEditMode ? 'Editar Disciplina' : 'Nova Disciplina'}
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {isEditMode
            ? 'Atualize as informações da disciplina'
            : 'Preencha os dados para criar uma nova disciplina'}
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
                  Código da Disciplina
                </span>
              </label>
              <input
                type="text"
                placeholder="ex: INF101, MAT201"
                className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
                {...register('code', {
                  required: 'Código é obrigatório',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  pattern: {
                    value: /^[A-Z0-9]+$/i,
                    message: 'Apenas letras e números',
                  },
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

            {/* Nome */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiBook className="inline w-4 h-4 mr-1" />
                  Nome da Disciplina
                </span>
              </label>
              <input
                type="text"
                placeholder="ex: Algoritmos e Estruturas de Dados"
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

            {/* Tipo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiType className="inline w-4 h-4 mr-1" />
                  Tipo da Disciplina
                </span>
              </label>
              <select
                className={`select select-bordered ${errors.type ? 'select-error' : ''}`}
                {...register('type', {
                  required: 'Tipo é obrigatório',
                })}
              >
                <option value="THEORETICAL">Teórica</option>
                <option value="PRACTICAL">Prática</option>
                <option value="THEORETICAL_PRACTICAL">Teórico-Prática</option>
              </select>
              {errors.type && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.type.message}</span>
                </label>
              )}
            </div>
          </div>

          <div className="divider"></div>

          {/* Carga Acadêmica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Carga Acadêmica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Créditos */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <FiAward className="inline w-4 h-4 mr-1" />
                    Créditos
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="ex: 4"
                  min="1"
                  max="20"
                  className={`input input-bordered ${errors.credits ? 'input-error' : ''}`}
                  {...register('credits', {
                    required: 'Créditos são obrigatórios',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Mínimo 1 crédito' },
                    max: { value: 20, message: 'Máximo 20 créditos' },
                  })}
                />
                {errors.credits && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.credits.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Número de créditos da disciplina
                  </span>
                </label>
              </div>

              {/* Carga Horária */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <FiClock className="inline w-4 h-4 mr-1" />
                    Carga Horária (horas)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="ex: 60"
                  min="15"
                  max="480"
                  step="15"
                  className={`input input-bordered ${errors.workload ? 'input-error' : ''}`}
                  {...register('workload', {
                    required: 'Carga horária é obrigatória',
                    valueAsNumber: true,
                    min: { value: 15, message: 'Mínimo 15 horas' },
                    max: { value: 480, message: 'Máximo 480 horas' },
                  })}
                />
                {errors.workload && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.workload.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Total de horas da disciplina
                  </span>
                </label>
              </div>
            </div>

            {/* Info Helper */}
            <div className="alert alert-info">
              <FiAward className="w-5 h-5" />
              <div className="text-sm">
                <strong>Dica:</strong> Geralmente, 1 crédito = 15 horas de aula. 
                Uma disciplina de 4 créditos teria 60 horas.
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
                  {isEditMode ? 'Atualizar' : 'Criar'} Disciplina
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/admin/disciplinas')}
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

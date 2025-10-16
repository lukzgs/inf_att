import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { api } from '@/services/api';

const createClassSchema = z.object({
  subjectId: z.number().min(1, 'Selecione uma disciplina'),
  code: z.string().min(1, 'Código é obrigatório').max(10),
  year: z.number().min(2020, 'Ano inválido').max(2030, 'Ano inválido'),
  semester: z.union([z.string(), z.number()]).refine(
    (val) => {
      const num = Number(val);
      return num === 1 || num === 2;
    },
    { message: 'Selecione um semestre' }
  ),
  location: z.string().optional(),
});

type CreateClassFormData = z.infer<typeof createClassSchema>;

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      semester: 1,
    },
  });

  // Buscar disciplinas
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await api.get('/disciplinas');
      return response.data;
    },
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: CreateClassFormData) => {
      const response = await api.post('/turmas', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Turma criada com sucesso!');
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao criar turma');
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateClassFormData) => {
    // Garantir que semester seja um número
    const formattedData = {
      ...data,
      semester: Number(data.semester),
    };
    createClassMutation.mutate(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-white dark:bg-base-100 shadow-2xl rounded-2xl border border-gray-200 dark:border-base-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-base-300">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Nova Turma
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Preencha os dados para criar uma nova turma
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-base-200"
            disabled={createClassMutation.isPending}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Disciplina */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-200">
                Disciplina *
              </span>
            </label>
            <select
              {...register('subjectId', { valueAsNumber: true })}
              className={`select select-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-2 ${
                errors.subjectId 
                  ? 'border-error focus:border-error' 
                  : 'border-gray-200 dark:border-base-300 focus:border-primary'
              }`}
            >
              <option value="">Selecione uma disciplina</option>
              {subjects?.map((subject: any) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <label className="label">
                <span className="label-text-alt text-error font-medium">
                  {errors.subjectId.message}
                </span>
              </label>
            )}
          </div>

          {/* Código da Turma */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-200">
                Código da Turma *
              </span>
            </label>
            <input
              {...register('code')}
              type="text"
              placeholder="Ex: A, B, U, X01"
              className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-2 ${
                errors.code 
                  ? 'border-error focus:border-error' 
                  : 'border-gray-200 dark:border-base-300 focus:border-primary'
              }`}
            />
            {errors.code && (
              <label className="label">
                <span className="label-text-alt text-error font-medium">
                  {errors.code.message}
                </span>
              </label>
            )}
          </div>

          {/* Ano e Semestre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 dark:text-gray-200">
                  Ano *
                </span>
              </label>
              <select
                {...register('year', { valueAsNumber: true })}
                className={`select select-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-2 ${
                  errors.year 
                    ? 'border-error focus:border-error' 
                    : 'border-gray-200 dark:border-base-300 focus:border-primary'
                }`}
              >
                <option value="">Selecione</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
              {errors.year && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.year.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 dark:text-gray-200">
                  Semestre *
                </span>
              </label>
              <div className="flex gap-4 items-center mt-3">
                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <input
                    {...register('semester')}
                    type="radio"
                    value="1"
                    defaultChecked
                    className="radio checked:bg-primary hover:bg-primary/80 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">1º Semestre</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <input
                    {...register('semester')}
                    type="radio"
                    value="2"
                    className="radio checked:bg-primary hover:bg-primary/80 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">2º Semestre</span>
                </label>
              </div>
              {errors.semester && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.semester.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Sala / Local */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-200">
                Sala / Local
              </span>
              <span className="label-text-alt text-gray-500 text-xs">Opcional</span>
            </label>
            <input
              {...register('location')}
              type="text"
              placeholder="Ex: 201, Lab 3, Online"
              className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-base-300 focus:border-primary"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-base-300">
            <button
              type="button"
              onClick={handleClose}
              className="btn-premium-outline flex-1"
              disabled={createClassMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-premium flex-1"
              disabled={createClassMutation.isPending}
            >
              {createClassMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Criando...
                </>
              ) : (
                'Criar Turma'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
    </div>
  );
}

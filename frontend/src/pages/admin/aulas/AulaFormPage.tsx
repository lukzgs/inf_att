import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLesson } from '../../../hooks/useLessons';
import { useClasses } from '../../../hooks/useClasses';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { FiSave, FiX, FiClock, FiCalendar, FiBook, FiFileText, FiAlignLeft } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface LessonFormData {
  name?: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  classId: number;
}

export default function AulaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Buscar dados da aula (modo edição)
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(id ? parseInt(id) : 0);

  // Buscar turmas disponíveis
  const { data: classes, isLoading: isLoadingClasses } = useClasses();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LessonFormData>({
    defaultValues: {
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '10:00',
      classId: 0,
    },
  });

  const watchStartTime = watch('startTime');

  // Preencher form com dados existentes (modo edição)
  useEffect(() => {
    if (lesson && isEditMode) {
      reset({
        name: lesson.name || '',
        description: lesson.description || '',
        date: lesson.date.split('T')[0], // Extrair apenas a data
        startTime: lesson.startTime.substring(0, 5), // HH:mm
        endTime: lesson.endTime.substring(0, 5), // HH:mm
        classId: lesson.classId,
      });
    }
  }, [lesson, isEditMode, reset]);

  // Mutation para criar/atualizar
  const mutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      if (isEditMode) {
        return await api.patch(`/aulas/${id}`, data);
      } else {
        return await api.post('/aulas', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success(`Aula ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
      navigate('/admin/aulas');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Erro ao salvar aula';
      toast.error(message);
    },
  });

  const onSubmit = (data: LessonFormData) => {
    // Validar horários
    if (data.startTime >= data.endTime) {
      toast.error('O horário de término deve ser após o horário de início');
      return;
    }

    mutation.mutate(data);
  };

  const isLoading = isLoadingLesson || isLoadingClasses;

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
          {isEditMode ? 'Editar Aula' : 'Nova Aula'}
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {isEditMode
            ? 'Atualize as informações da aula'
            : 'Preencha os dados para criar uma nova aula'}
        </p>
      </div>

      {/* Form */}
      <div className="card bg-base-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body p-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>

            {/* Nome */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiFileText className="inline w-4 h-4 mr-1" />
                  Nome da Aula
                </span>
                <span className="label-text-alt text-base-content/60">Opcional</span>
              </label>
              <input
                type="text"
                placeholder="ex: Introdução aos Algoritmos"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...register('name')}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            {/* Descrição */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiAlignLeft className="inline w-4 h-4 mr-1" />
                  Descrição
                </span>
                <span className="label-text-alt text-base-content/60">Opcional</span>
              </label>
              <textarea
                placeholder="ex: Aula sobre conceitos básicos de algoritmos e estruturas de dados"
                className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                {...register('description')}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            {/* Turma */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiBook className="inline w-4 h-4 mr-1" />
                  Turma
                </span>
              </label>
              <select
                className={`select select-bordered ${errors.classId ? 'select-error' : ''}`}
                {...register('classId', {
                  required: 'Turma é obrigatória',
                  valueAsNumber: true,
                  validate: (value) => value > 0 || 'Selecione uma turma',
                })}
              >
                <option value={0}>Selecione uma turma</option>
                {classes?.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.code} - {classItem.subject?.name} ({classItem.year}/{classItem.semester})
                  </option>
                ))}
              </select>
              {errors.classId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.classId.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="divider"></div>

          {/* Data e Horário */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Data e Horário</h3>

            {/* Data */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  Data da Aula
                </span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${errors.date ? 'input-error' : ''}`}
                {...register('date', {
                  required: 'Data é obrigatória',
                })}
              />
              {errors.date && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.date.message}
                  </span>
                </label>
              )}
            </div>

            {/* Horários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Horário de Início */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <FiClock className="inline w-4 h-4 mr-1" />
                    Horário de Início
                  </span>
                </label>
                <input
                  type="time"
                  className={`input input-bordered ${errors.startTime ? 'input-error' : ''}`}
                  {...register('startTime', {
                    required: 'Horário de início é obrigatório',
                  })}
                />
                {errors.startTime && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.startTime.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Horário de Término */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <FiClock className="inline w-4 h-4 mr-1" />
                    Horário de Término
                  </span>
                </label>
                <input
                  type="time"
                  className={`input input-bordered ${errors.endTime ? 'input-error' : ''}`}
                  {...register('endTime', {
                    required: 'Horário de término é obrigatório',
                  })}
                />
                {errors.endTime && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.endTime.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Info Helper */}
            <div className="alert alert-info">
              <FiClock className="w-5 h-5" />
              <div className="text-sm">
                <strong>Dica:</strong> Certifique-se de que o horário de término seja após o horário de início.
                {watchStartTime && ` Início: ${watchStartTime}`}
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
                  {isEditMode ? 'Atualizar' : 'Criar'} Aula
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/admin/aulas')}
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

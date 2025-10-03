import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import {
  useAttendance,
  useCreateAttendance,
  useUpdateAttendance,
  type CreateAttendanceDto,
  type UpdateAttendanceDto,
} from '../../../hooks/useAttendances';
import { useLessons } from '../../../hooks/useLessons';
import { useUsers } from '../../../hooks/useUsers';

interface FormData {
  lessonId: number;
  userId: number;
  isPresent: boolean;
  justification?: string;
  editedBy?: number;
  editReason?: string;
}

export default function PresencaFormPage() {
  const navigate = useNavigate();
  const { lessonId, userId } = useParams<{ lessonId: string; userId: string }>();
  const isEditing = !!lessonId && !!userId;

  const { data: attendance, isLoading: isLoadingAttendance } = useAttendance(
    Number(lessonId),
    Number(userId)
  );
  const { data: lessons } = useLessons();
  const { data: users } = useUsers();
  const createAttendance = useCreateAttendance();
  const updateAttendance = useUpdateAttendance();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      isPresent: true,
      justification: '',
      editReason: '',
    },
  });

  const watchIsPresent = watch('isPresent');
  const watchJustification = watch('justification');

  // Filter only open lessons for registration
  const openLessons = lessons?.filter((lesson) => lesson.isOpen);

  useEffect(() => {
    if (isEditing && attendance) {
      reset({
        lessonId: attendance.lessonId,
        userId: attendance.userId,
        isPresent: attendance.isPresent,
        justification: attendance.justification || '',
        editReason: '',
      });
    }
  }, [attendance, isEditing, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        // Update existing attendance
        const updateData: UpdateAttendanceDto = {
          isPresent: data.isPresent,
          justification: data.justification,
          // TODO: Get editedBy from auth context
          editedBy: 1,
          editReason: data.editReason,
        };

        await updateAttendance.mutateAsync({
          lessonId: Number(lessonId),
          userId: Number(userId),
          data: updateData,
        });

        toast.success('Presença atualizada com sucesso!');
      } else {
        // Create new attendance
        const createData: CreateAttendanceDto = {
          lessonId: data.lessonId,
          userId: data.userId,
          isPresent: data.isPresent,
          justification: data.justification,
        };

        await createAttendance.mutateAsync(createData);
        toast.success('Presença registrada com sucesso!');
      }

      navigate('/admin/presencas');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao salvar presença';
      toast.error(errorMessage);
      console.error('Erro ao salvar presença:', error);
    }
  };

  if (isEditing && isLoadingAttendance) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? 'Editar Presença' : 'Registrar Presença'}
        </h1>
        <p className="text-gray-400 mt-1">
          {isEditing
            ? 'Atualize o registro de presença e adicione um motivo para a edição'
            : 'Registre a presença de um aluno em uma aula'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Informações da Presença</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lesson Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Aula <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  {...register('lessonId', {
                    required: 'Aula é obrigatória',
                    valueAsNumber: true,
                    validate: (value) => value > 0 || 'Selecione uma aula',
                  })}
                  className={`select select-bordered ${errors.lessonId ? 'select-error' : ''}`}
                  disabled={isEditing}
                >
                  <option value="">Selecione uma aula</option>
                  {openLessons?.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name
                        ? `${lesson.name} - ${lesson.class?.code || ''}`
                        : `${lesson.class?.code || 'Turma'} - ${new Date(lesson.date).toLocaleDateString('pt-BR')}`}
                      {' '}
                      ({lesson.startTime.substring(0, 5)} - {lesson.endTime.substring(0, 5)})
                    </option>
                  ))}
                </select>
                {errors.lessonId && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.lessonId.message}</span>
                  </label>
                )}
                {!isEditing && openLessons && openLessons.length === 0 && (
                  <label className="label">
                    <span className="label-text-alt text-warning">
                      Nenhuma aula aberta no momento. Abra uma aula antes de registrar presença.
                    </span>
                  </label>
                )}
              </div>

              {/* User Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Aluno <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  {...register('userId', {
                    required: 'Aluno é obrigatório',
                    valueAsNumber: true,
                    validate: (value) => value > 0 || 'Selecione um aluno',
                  })}
                  className={`select select-bordered ${errors.userId ? 'select-error' : ''}`}
                  disabled={isEditing}
                >
                  <option value="">Selecione um aluno</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.userId.message}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Status <span className="text-error">*</span>
                </span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    {...register('isPresent')}
                    value="true"
                    className="radio radio-success"
                  />
                  <span className="label-text">Presente</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    {...register('isPresent')}
                    value="false"
                    className="radio radio-error"
                  />
                  <span className="label-text">Ausente</span>
                </label>
              </div>
            </div>

            {/* Justification */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Justificativa
                  {!watchIsPresent && watchJustification === '' && (
                    <span className="text-warning ml-2">(Recomendado para ausências)</span>
                  )}
                </span>
              </label>
              <textarea
                {...register('justification')}
                className="textarea textarea-bordered h-24"
                placeholder="Digite uma justificativa (opcional)"
              />
            </div>

            {/* Edit Reason (only when editing) */}
            {isEditing && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Motivo da Edição <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  {...register('editReason', {
                    required: isEditing ? 'Motivo da edição é obrigatório' : false,
                  })}
                  className={`textarea textarea-bordered h-24 ${errors.editReason ? 'textarea-error' : ''}`}
                  placeholder="Explique o motivo desta alteração"
                />
                {errors.editReason && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.editReason.message}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-info">
                    <FiAlertCircle className="inline mr-1" />
                    Este campo é obrigatório para fins de auditoria
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Alert for editing */}
        {isEditing && (
          <div className="alert alert-warning">
            <FiAlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Atenção</h3>
              <div className="text-sm">
                Você está editando um registro de presença existente. Todas as alterações serão
                registradas para fins de auditoria.
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Salvando...
              </>
            ) : (
              <>
                <FiSave />
                {isEditing ? 'Atualizar' : 'Registrar'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/presencas')}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            <FiX />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

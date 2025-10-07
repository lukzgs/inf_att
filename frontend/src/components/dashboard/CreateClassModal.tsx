import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import { api } from '@/services/api';

const createClassSchema = z.object({
  subjectId: z.number().min(1, 'Selecione uma disciplina'),
  code: z.string().min(1, 'Código é obrigatório').max(10),
  semester: z.string().regex(/^\d{4}\/[12]$/, 'Formato inválido (ex: 2025/1)'),
  room: z.string().optional(),
  schedules: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
  })).min(1, 'Adicione pelo menos um horário'),
});

type CreateClassFormData = z.infer<typeof createClassSchema>;

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const daysOfWeek = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
  const queryClient = useQueryClient();
  const [schedules, setSchedules] = useState<Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
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

  const addSchedule = () => {
    const newSchedule = {
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
    };
    setSchedules([...schedules, newSchedule]);
    setValue('schedules', [...schedules, newSchedule]);
  };

  const removeSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
    setValue('schedules', newSchedules);
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
    setValue('schedules', newSchedules);
  };

  const handleClose = () => {
    reset();
    setSchedules([]);
    onClose();
  };

  const onSubmit = (data: CreateClassFormData) => {
    createClassMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Criar Nova Turma</h3>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={createClassMutation.isPending}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Disciplina */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Disciplina *</span>
            </label>
            <select
              {...register('subjectId', { valueAsNumber: true })}
              className={`select select-bordered w-full ${
                errors.subjectId ? 'select-error' : ''
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
                <span className="label-text-alt text-error">
                  {errors.subjectId.message}
                </span>
              </label>
            )}
          </div>

          {/* Código e Semestre */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Código da Turma *</span>
              </label>
              <input
                {...register('code')}
                type="text"
                placeholder="Ex: A, B, U, X01"
                className={`input input-bordered ${
                  errors.code ? 'input-error' : ''
                }`}
              />
              {errors.code && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.code.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Semestre *</span>
              </label>
              <input
                {...register('semester')}
                type="text"
                placeholder="2025/1"
                className={`input input-bordered ${
                  errors.semester ? 'input-error' : ''
                }`}
              />
              {errors.semester && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.semester.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Sala */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Sala / Local</span>
            </label>
            <input
              {...register('room')}
              type="text"
              placeholder="Ex: 201, Lab 3, Online"
              className="input input-bordered"
            />
          </div>

          {/* Horários */}
          <div className="form-control">
            <div className="flex items-center justify-between mb-3">
              <label className="label">
                <span className="label-text font-semibold">Horários das Aulas *</span>
              </label>
              <button
                type="button"
                onClick={addSchedule}
                className="btn btn-sm btn-accent gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar Horário
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="alert alert-info">
                <span>Adicione pelo menos um horário de aula</span>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-2 p-3 bg-base-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text text-xs">Dia da Semana</span>
                      </label>
                      <select
                        value={schedule.dayOfWeek}
                        onChange={(e) =>
                          updateSchedule(index, 'dayOfWeek', Number(e.target.value))
                        }
                        className="select select-bordered select-sm w-full"
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text text-xs">Início</span>
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          updateSchedule(index, 'startTime', e.target.value)
                        }
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text text-xs">Fim</span>
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          updateSchedule(index, 'endTime', e.target.value)
                        }
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.schedules && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.schedules.message}
                </span>
              </label>
            )}
          </div>

          {/* Botões */}
          <div className="modal-action">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={createClassMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-accent"
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
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}

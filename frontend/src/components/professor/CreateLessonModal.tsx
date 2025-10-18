import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiCalendar, FiClock, FiLock, FiRepeat, FiInfo } from 'react-icons/fi';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';

const WEEKDAYS = [
  { value: 0, label: 'Dom', fullLabel: 'Domingo' },
  { value: 1, label: 'Seg', fullLabel: 'Segunda' },
  { value: 2, label: 'Ter', fullLabel: 'Terça' },
  { value: 3, label: 'Qua', fullLabel: 'Quarta' },
  { value: 4, label: 'Qui', fullLabel: 'Quinta' },
  { value: 5, label: 'Sex', fullLabel: 'Sexta' },
  { value: 6, label: 'Sáb', fullLabel: 'Sábado' },
];

const createLessonSchema = z.object({
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  name: z.string().optional(),
  description: z.string().optional(),
  requirePassword: z.boolean().optional(),
  attendancePassword: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringWeekdays: z.array(z.number()).optional(),
  numberOfWeeks: z.number().min(1).max(20).optional(),
}).refine((data) => {
  // Validação de senha: só valida se requirePassword estiver ativo
  if (data.requirePassword) {
    if (!data.attendancePassword || data.attendancePassword.length < 4 || data.attendancePassword.length > 20) {
      return false;
    }
  }
  return true;
}, {
  message: 'Senha deve ter entre 4 e 20 caracteres',
  path: ['attendancePassword'],
}).refine((data) => {
  // Validação de dias: só valida se isRecurring estiver ativo
  if (data.isRecurring === true) {
    if (!data.recurringWeekdays || data.recurringWeekdays.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: 'Selecione pelo menos um dia da semana',
  path: ['recurringWeekdays'],
}).refine((data) => {
  // Validação de semanas: só valida se isRecurring estiver ativo
  if (data.isRecurring === true) {
    if (!data.numberOfWeeks || data.numberOfWeeks < 1) {
      return false;
    }
  }
  return true;
}, {
  message: 'Informe o número de semanas',
  path: ['numberOfWeeks'],
});

type CreateLessonForm = z.infer<typeof createLessonSchema>;

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
}

const formatDateToISO = (date: Date): string => {
  // Formata como ISO Date string (YYYY-MM-DDTHH:mm:ss.sssZ)
  // Mas mantendo a data local, sem conversão de timezone
  // Trata a data como se estivesse em UTC para não fazer conversão
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}T00:00:00.000Z`;
  console.log('📅 formatDateToISO:', {
    input: date.toString(),
    year,
    month,
    day,
    output: result
  });
  return result;
};

const formatTimeToISO = (date: Date): string => {
  // Para campos @db.Time do Prisma, precisa ser DateTime ISO-8601 completo
  // Usa a data de 1970-01-01 como base (padrão para Time)
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `1970-01-01T${hours}:${minutes}:00.000Z`;
};

// Generate recurring lesson dates
const generateRecurringDates = (
  startDate: Date,
  weekdays: number[],
  numberOfWeeks: number
): Date[] => {
  const dates: Date[] = [];
  const startWeekday = startDate.getDay();
  
  for (let week = 0; week < numberOfWeeks; week++) {
    for (const weekday of weekdays) {
      const daysOffset = (weekday - startWeekday + 7) % 7 + (week * 7);
      const lessonDate = new Date(startDate);
      lessonDate.setDate(startDate.getDate() + daysOffset);
      dates.push(lessonDate);
    }
  }
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

export function CreateLessonModal({ isOpen, onClose, classId }: CreateLessonModalProps) {
  const queryClient = useQueryClient();
  const [requirePassword, setRequirePassword] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateLessonForm>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      requirePassword: false,
      isRecurring: false,
      recurringWeekdays: [],
      numberOfWeeks: 4,
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data: CreateLessonForm) => {
      const token = localStorage.getItem('authToken');
      
      console.log('📝 Dados do formulário:', data);
      
      // Generate lessons based on recurrence
      const lessons = [];
      
      if (data.isRecurring && data.recurringWeekdays && data.numberOfWeeks) {
        const dates = generateRecurringDates(
          data.date,
          data.recurringWeekdays,
          data.numberOfWeeks
        );
        
        for (const lessonDate of dates) {
          lessons.push({
            classId,
            date: formatDateToISO(lessonDate),
            startTime: formatTimeToISO(data.startTime),
            endTime: formatTimeToISO(data.endTime),
            name: data.name || undefined,
            description: data.description || undefined,
            attendancePassword: data.requirePassword ? data.attendancePassword : undefined,
          });
        }
      } else {
        lessons.push({
          classId,
          date: formatDateToISO(data.date),
          startTime: formatTimeToISO(data.startTime),
          endTime: formatTimeToISO(data.endTime),
          name: data.name || undefined,
          description: data.description || undefined,
          attendancePassword: data.requirePassword ? data.attendancePassword : undefined,
        });
      }

      console.log('📤 Enviando para API:', lessons);

      // Create all lessons
      const results = await Promise.all(
        lessons.map(async (lesson) => {
          const response = await fetch('http://localhost:3000/aulas', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(lesson),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('❌ Erro do backend:', error);
            throw new Error(error.message || 'Erro ao criar aula');
          }

          return response.json();
        })
      );

      return results;
    },
    onSuccess: (results) => {
      const count = results.length;
      toast.success(
        count === 1 
          ? 'Aula criada com sucesso!' 
          : `${count} aulas criadas com sucesso!`
      );
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar aula(s)');
    },
  });

  const onSubmit = (data: CreateLessonForm) => {
    console.log('✅ Validação passou! Criando aula...', data);
    createLessonMutation.mutate(data);
  };

  const onError = (errors: any) => {
    console.error('❌ Erros de validação:', errors);
    toast.error('Verifique os campos obrigatórios');
  };

  const handleClose = () => {
    reset();
    setRequirePassword(false);
    setIsRecurring(false);
    setSelectedWeekdays([]);
    onClose();
  };

  const toggleWeekday = (weekday: number) => {
    const newSelection = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter(w => w !== weekday)
      : [...selectedWeekdays, weekday].sort();
    
    setSelectedWeekdays(newSelection);
    setValue('recurringWeekdays', newSelection);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-base-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-base-content/10 sticky top-0 bg-white dark:bg-base-200 z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Criar Nova Aula
            </h2>
            <p className="text-base text-gray-600 dark:text-base-content/70 mt-1">
              Preencha os dados da aula ou crie aulas recorrentes
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-6">
          
          {/* Recorrência Toggle */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiRepeat className="w-5 h-5 text-primary" />
                <span className="font-medium text-base text-gray-900 dark:text-white">
                  Aulas Recorrentes
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-lg bg-gray-300 border-gray-400 
                          [--tglbg:theme(colors.gray.300)] 
                          checked:bg-primary checked:border-primary
                          hover:bg-gray-400 dark:bg-gray-600 dark:border-gray-500
                          dark:checked:bg-primary dark:checked:border-primary"
                checked={isRecurring}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsRecurring(checked);
                  setValue('isRecurring', checked);
                  if (!checked) {
                    setSelectedWeekdays([]);
                    setValue('recurringWeekdays', []);
                  }
                }}
              />
            </div>
            <p className="text-base text-gray-600 dark:text-base-content/70">
              Crie múltiplas aulas automaticamente nos mesmos dias da semana
            </p>
          </div>

          {/* Data Inicial */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                {isRecurring ? 'Data Inicial *' : 'Data da Aula *'}
              </span>
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ptBR}
                  minDate={new Date()}
                  className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-base"
                  calendarClassName="bg-white dark:bg-base-200"
                  placeholderText="Selecione a data"
                />
              )}
            />
            {errors.date && (
              <p className="text-error text-base mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Dias da Semana (se recorrente) */}
          {isRecurring && (
            <div>
              <label className="label">
                <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                  Dias da Semana *
                </span>
              </label>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`
                      px-3 py-3 rounded-lg font-medium text-base transition-all
                      ${selectedWeekdays.includes(day.value)
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-base-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-100'
                      }
                    `}
                    title={day.fullLabel}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.recurringWeekdays && (
                <p className="text-error text-base mt-1">{errors.recurringWeekdays.message}</p>
              )}
            </div>
          )}

          {/* Número de Semanas (se recorrente) */}
          {isRecurring && (
            <div>
              <label className="label">
                <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                  Número de Semanas *
                </span>
              </label>
              <input
                type="number"
                {...register('numberOfWeeks', { valueAsNumber: true })}
                min={1}
                max={20}
                className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-base"
                placeholder="Ex: 4"
              />
              {errors.numberOfWeeks && (
                <p className="text-error text-base mt-1">{errors.numberOfWeeks.message}</p>
              )}
              <div className="alert alert-info mt-2">
                <FiInfo className="w-5 h-5" />
                <span className="text-base">
                  Serão criadas{' '}
                  <strong>
                    {selectedWeekdays.length * (watch('numberOfWeeks') || 0)} aulas
                  </strong>{' '}
                  no total
                </span>
              </div>
            </div>
          )}

          {/* Horários */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                  <FiClock className="inline w-4 h-4 mr-2" />
                  Início *
                </span>
              </label>
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    locale={ptBR}
                    className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-base"
                    placeholderText="00:00"
                  />
                )}
              />
              {errors.startTime && (
                <p className="text-error text-base mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                  <FiClock className="inline w-4 h-4 mr-2" />
                  Término *
                </span>
              </label>
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    locale={ptBR}
                    className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-base"
                    placeholderText="00:00"
                  />
                )}
              />
              {errors.endTime && (
                <p className="text-error text-base mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Nome (opcional) */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                Título da Aula (opcional)
              </span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ex: Aula sobre Estruturas de Dados"
              className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-base"
            />
          </div>

          {/* Descrição (opcional) */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                Descrição (opcional)
              </span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Descreva o conteúdo da aula..."
              className="textarea textarea-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-base"
            />
          </div>

          {/* Senha de Presença */}
          <div className="border border-gray-200 dark:border-base-content/10 rounded-lg p-4 bg-gray-50 dark:bg-base-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiLock className="w-5 h-5 text-primary" />
                <span className="font-medium text-base text-gray-900 dark:text-white">
                  Exigir Senha para Presença
                </span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-lg bg-gray-300 border-gray-400 
                          [--tglbg:theme(colors.gray.300)] 
                          checked:bg-primary checked:border-primary
                          hover:bg-gray-400 dark:bg-gray-600 dark:border-gray-500
                          dark:checked:bg-primary dark:checked:border-primary"
                checked={requirePassword}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRequirePassword(checked);
                  setValue('requirePassword', checked);
                  if (!checked) {
                    setValue('attendancePassword', '');
                  }
                }}
              />
            </div>

            <p className="text-base text-gray-600 dark:text-base-content/70 mb-3">
              Ao ativar, os alunos precisarão digitar a senha para registrar presença
            </p>

            {requirePassword && (
              <div>
                <label className="label">
                  <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">
                    Senha (4-20 caracteres)
                  </span>
                </label>
                <input
                  type="text"
                  {...register('attendancePassword')}
                  placeholder="Ex: AULA123"
                  className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-base"
                  maxLength={20}
                />
                {errors.attendancePassword && (
                  <p className="text-error text-base mt-1">
                    {errors.attendancePassword.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-base-content/60 mt-2">
                  💡 Dica: Use uma senha fácil de ditar em aula (ex: códigos simples)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {createLessonMutation.isError && (
            <div className="alert alert-error">
              <span className="text-base">
                {createLessonMutation.error instanceof Error
                  ? createLessonMutation.error.message
                  : 'Erro ao criar aula(s)'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-base-200 pb-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn-premium-outline flex-1 text-base"
              disabled={createLessonMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-premium flex-1 text-base"
              disabled={createLessonMutation.isPending}
            >
              {createLessonMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Criando...
                </>
              ) : (
                isRecurring
                  ? `Criar ${selectedWeekdays.length * (watch('numberOfWeeks') || 0)} Aulas`
                  : 'Criar Aula'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

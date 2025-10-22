import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiCalendar, FiClock, FiLock, FiRepeat, FiInfo, FiBook } from 'react-icons/fi';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-base-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-base-300 overflow-hidden">
        
        {/* Header - Inspirado em NotificationCenter */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-base-300 bg-gradient-to-r from-white to-gray-50 dark:from-base-100 dark:to-gray-800/50 flex-shrink-0">
          <h3 className="text-lg font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
              <FiBook className="text-gray-600 dark:text-gray-400" size={20} />
            </div>
            <span>Criar Nova Aula</span>
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title="Fechar"
            disabled={createLessonMutation.isPending}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Recorrência Card */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-base-content/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                  <FiRepeat className="text-gray-600 dark:text-gray-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Aulas Recorrentes</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Criar múltiplas aulas automaticamente</p>
                </div>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-sm"
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
          </div>

          {/* Data Card */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-base-content/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                <FiCalendar className="text-gray-600 dark:text-gray-400" size={18} />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Data e Horário</h4>
            </div>

            <div className="space-y-4">
              {/* Data */}
              <div>
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300">
                    {isRecurring ? 'Data Inicial' : 'Data da Aula'} *
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
                      className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-sm rounded-lg h-10 ${
                        errors.date ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-base-content/20'
                      }`}
                      calendarClassName="bg-white dark:bg-base-200"
                      placeholderText="Selecione a data"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">{errors.date.message}</p>
                )}
              </div>

              {/* Horários - Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
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
                        className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-sm rounded-lg h-10 ${
                          errors.startTime ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-base-content/20'
                        }`}
                        placeholderText="00:00"
                      />
                    )}
                  />
                  {errors.startTime && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
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
                        className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-sm rounded-lg h-10 ${
                          errors.endTime ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-base-content/20'
                        }`}
                        placeholderText="00:00"
                      />
                    )}
                  />
                  {errors.endTime && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">{errors.endTime.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dias da Semana - Mostrado se recorrente */}
          {isRecurring && (
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-base-content/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="text-gray-600 dark:text-gray-400" size={18} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Dias da Semana</h4>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`
                      px-2 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center
                      ${selectedWeekdays.includes(day.value)
                        ? 'bg-gray-900 text-white shadow-md'
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
                <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.recurringWeekdays.message}</p>
              )}

              {/* Número de Semanas */}
              <div className="mt-4">
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300">
                    Número de Semanas *
                  </span>
                </label>
                <input
                  type="number"
                  {...register('numberOfWeeks', { valueAsNumber: true })}
                  min={1}
                  max={20}
                  className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white text-sm rounded-lg h-10 ${
                    errors.numberOfWeeks ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-base-content/20'
                  }`}
                  placeholder="Ex: 4"
                />
                {errors.numberOfWeeks && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">{errors.numberOfWeeks.message}</p>
                )}
                {selectedWeekdays.length > 0 && watch('numberOfWeeks') && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <FiInfo size={14} />
                    Serão criadas <strong>{selectedWeekdays.length * (watch('numberOfWeeks') || 0)} aulas</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Informações Opcionais */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-base-content/10">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Informações Adicionais</h4>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300">
                    Título da Aula (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Ex: Aula sobre Estruturas de Dados"
                  className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm rounded-lg h-10 border-gray-200 dark:border-base-content/20"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300">
                    Descrição (opcional)
                  </span>
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  placeholder="Descreva o conteúdo da aula..."
                  className="textarea textarea-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm rounded-lg border-gray-200 dark:border-base-content/20"
                />
              </div>
            </div>
          </div>

          {/* Senha de Presença */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-base-content/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                  <FiLock className="text-gray-600 dark:text-gray-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Exigir Senha</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Para registro de presença</p>
                </div>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-sm"
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

            {requirePassword && (
              <div>
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-700 dark:text-gray-300">
                    Senha (4-20 caracteres) *
                  </span>
                </label>
                <input
                  type="text"
                  {...register('attendancePassword')}
                  placeholder="Ex: AULA123"
                  className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm rounded-lg h-10 ${
                    errors.attendancePassword ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-base-content/20'
                  }`}
                  maxLength={20}
                />
                {errors.attendancePassword && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">{errors.attendancePassword.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {createLessonMutation.isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                {createLessonMutation.error instanceof Error
                  ? createLessonMutation.error.message
                  : 'Erro ao criar aula(s)'}
              </p>
            </div>
          )}
        </form>

        {/* Footer Buttons - Sticky */}
        <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 p-6 flex-shrink-0">
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 min-w-[140px]"
              disabled={createLessonMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit, onError)}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 gap-2 flex items-center justify-center min-w-[140px]"
              disabled={createLessonMutation.isPending}
            >
              {createLessonMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  <span className="hidden sm:inline">Criando...</span>
                </>
              ) : isRecurring ? (
                <>
                  <span className="hidden sm:inline">{`Criar ${selectedWeekdays.length * (watch('numberOfWeeks') || 0)} Aulas`}</span>
                  <span className="sm:hidden">Criar</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Criar Aula</span>
                  <span className="sm:hidden">Criar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FiX, FiBook, FiHash, FiCalendar, FiMapPin, FiSave } from 'react-icons/fi';
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
  enrollmentPassword: z.string().min(3, 'Senha deve ter pelo menos 3 caracteres'),
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
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto relative z-50 bg-white dark:bg-base-100 p-0 rounded-2xl shadow-2xl">
          {/* Header Minimalista */}
          <div className="sticky top-0 bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-content/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                <FiBook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  Nova Turma
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Preencha os dados para criar uma nova turma
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200 flex-shrink-0"
              disabled={createClassMutation.isPending}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Informações da Turma */}
            <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                  <FiBook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">Informações da Turma</h4>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Disciplina Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiBook className="w-4 h-4" />
                      Disciplina
                    </span>
                  </label>
                  <select
                    {...register('subjectId', { valueAsNumber: true })}
                    className={`select select-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg ${
                      errors.subjectId 
                        ? 'border-2 border-red-500 dark:border-red-500' 
                        : 'border border-gray-200 dark:border-base-content/20'
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
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.subjectId.message}
                    </p>
                  )}
                </div>

                {/* Código da Turma Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiHash className="w-4 h-4" />
                      Código da Turma
                    </span>
                  </label>
                  <input
                    {...register('code')}
                    type="text"
                    placeholder="Ex: A, B, U, X01"
                    className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg ${
                      errors.code 
                        ? 'border-2 border-red-500 dark:border-red-500' 
                        : 'border border-gray-200 dark:border-base-content/20'
                    }`}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Ano e Semestre - Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ano Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiCalendar className="w-3.5 h-3.5" />
                        Ano
                      </span>
                    </label>
                    <select
                      {...register('year', { valueAsNumber: true })}
                      className={`select select-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg ${
                        errors.year 
                          ? 'border-2 border-red-500 dark:border-red-500' 
                          : 'border border-gray-200 dark:border-base-content/20'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                    {errors.year && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  {/* Semestre Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiCalendar className="w-3.5 h-3.5" />
                        Semestre
                      </span>
                    </label>
                    <div className="flex gap-6 items-center mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...register('semester')}
                          type="radio"
                          value="1"
                          defaultChecked
                          className="radio border-gray-300 checked:border-gray-300 bg-white checked:bg-white [&:checked]:before:bg-gray-900"
                          style={{
                            '--chkbg': 'white',
                            '--chkfg': 'black',
                          } as React.CSSProperties}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">1º Semestre</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...register('semester')}
                          type="radio"
                          value="2"
                          className="radio border-gray-300 checked:border-gray-300 bg-white checked:bg-white [&:checked]:before:bg-gray-900"
                          style={{
                            '--chkbg': 'white',
                            '--chkfg': 'black',
                          } as React.CSSProperties}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">2º Semestre</span>
                      </label>
                    </div>
                    {errors.semester && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                        {errors.semester.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sala / Local Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      Sala / Local <span className="text-xs text-gray-500 dark:text-gray-500">(opcional)</span>
                    </span>
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="Ex: 201, Lab 3, Online"
                    className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                  />
                </div>

                {/* Senha de Enrollment Field */}
                <div className="form-control bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/40">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiHash className="w-4 h-4" />
                      Senha de Acesso à Turma
                    </span>
                    <span className="label-text-alt text-xs text-gray-500 dark:text-gray-400">Alunos usarão para entrar</span>
                  </label>
                  <input
                    {...register('enrollmentPassword')}
                    type="text"
                    placeholder="Ex: 123456"
                    className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                  />
                  {errors.enrollmentPassword && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.enrollmentPassword.message}
                    </p>
                  )}
                </div>

                {/* Botões */}
                <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 p-6 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 min-w-[140px]"
                    disabled={createClassMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 gap-2 flex items-center justify-center min-w-[140px]"
                    disabled={createClassMutation.isPending}
                  >
                    {createClassMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">Criando...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span className="hidden sm:inline">Criar Turma</span>
                        <span className="sm:hidden">Criar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

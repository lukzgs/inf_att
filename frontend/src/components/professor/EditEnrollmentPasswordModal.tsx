import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FiX, FiHash, FiSave, FiCopy } from 'react-icons/fi';
import { api } from '@/services/api';

interface EditEnrollmentPasswordModalProps {
  isOpen: boolean;
  classId: number;
  currentPassword?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  newEnrollmentPassword: string;
}

export function EditEnrollmentPasswordModal({
  isOpen,
  classId,
  currentPassword,
  onClose,
  onSuccess,
}: EditEnrollmentPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      newEnrollmentPassword: currentPassword || '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(
        `/usuarios-turmas/${classId}/enrollment-password`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Senha de acesso atualizada com sucesso!');
      reset();
      onClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar senha'
      );
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const copyToClipboard = () => {
    if (currentPassword) {
      navigator.clipboard.writeText(currentPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Senha copiada!');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="modal modal-open">
        <div className="modal-box max-w-md relative z-50 bg-white dark:bg-base-100 p-0 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-content/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                <FiHash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                  Editar Senha de Acesso
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200 flex-shrink-0"
              disabled={mutation.isPending}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Informação */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Essa senha é usada pelos alunos para acessar a turma. Você pode alterá-la a qualquer momento.
              </p>
            </div>

            {/* Senha Atual */}
            {currentPassword && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                    Senha Atual
                  </span>
                </label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 p-3 bg-gray-100 dark:bg-base-200 rounded-lg text-sm font-mono text-gray-900 dark:text-white truncate">
                    {currentPassword}
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`btn btn-sm btn-ghost ${copied ? 'btn-active' : ''}`}
                    title="Copiar senha"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Nova Senha */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                  Nova Senha
                </span>
              </label>
              <input
                type="password"
                placeholder="Digite a nova senha"
                className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg ${
                  errors.newEnrollmentPassword
                    ? 'border-2 border-red-500 dark:border-red-500'
                    : 'border border-gray-200 dark:border-base-content/20'
                }`}
                {...register('newEnrollmentPassword', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres',
                  },
                })}
              />
              {errors.newEnrollmentPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                  {errors.newEnrollmentPassword.message}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 -mx-6 -mb-6 px-6 py-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                disabled={mutation.isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 gap-2 flex items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="hidden sm:inline">Atualizando...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span className="hidden sm:inline">Atualizar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { FiX, FiClock, FiCalendar, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';
import { formatDateBR } from '@/utils/format';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Props do LessonAttendanceModal
 */
export interface LessonAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: number;
    name?: string;
    date: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
    attendancePassword?: string;
    classId: number;
    class?: {
      code: string;
      subject?: {
        name: string;
      };
    };
    attendances?: Array<{
      userId: number;
      isPresent: boolean;
    }>;
  };
  classId: number;
  userId?: number;
  onSuccess?: () => void;
}

/**
 * Estados possíveis do modal
 */
type ModalState = 'initial' | 'asking-code' | 'validating' | 'success' | 'error' | 'already_marked';

/**
 * Modal para marcar presença em uma aula específica
 * 
 * Funcionalidades:
 * - Input de código de presença de 6 dígitos
 * - Validação em tempo real
 * - Feedback visual (sucesso, erro, validando)
 * - Verificação se já foi marcada presença
 * - Design minimalista seguindo padrão professor
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <LessonAttendanceModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   lesson={lessonData}
 *   classId={classId}
 *   userId={userId}
 * />
 * ```
 */
export function LessonAttendanceModal({
  isOpen,
  onClose,
  lesson,
  userId,
  onSuccess,
}: LessonAttendanceModalProps) {
  const queryClient = useQueryClient();

  // Estados
  const [code, setCode] = useState('');
  const [modalState, setModalState] = useState<ModalState>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFormat, setPasswordFormat] = useState('');

  // Verificar se já foi marcada presença
  const hasAttendance = lesson.attendances?.some(a => a.userId === userId && a.isPresent);

  // Verificar se está no horário da aula (ou até 30 min após o término)
  const isWithinLessonTime = () => {
    const now = new Date();
    
    // Parse da data sem conversão UTC
    let year: number, month: number, day: number;
    
    if (lesson.date.includes('T')) {
      const dateObj = new Date(lesson.date);
      year = dateObj.getUTCFullYear();
      month = dateObj.getUTCMonth();
      day = dateObj.getUTCDate();
    } else {
      const [y, m, d] = lesson.date.split('-').map(Number);
      year = y;
      month = m - 1;
      day = d;
    }
    
    // Extrair horários
    const extractTime = (timeStr: string) => {
      if (timeStr.includes('T')) {
        return timeStr.split('T')[1].substring(0, 5);
      }
      return timeStr.substring(0, 5);
    };
    
    const [startHours, startMinutes] = extractTime(lesson.startTime).split(':').map(Number);
    const [endHours, endMinutes] = extractTime(lesson.endTime).split(':').map(Number);
    
    const startDateTime = new Date(year, month, day, startHours, startMinutes, 0, 0);
    const endDateTime = new Date(year, month, day, endHours, endMinutes, 0, 0);
    
    // Permitir marcar presença até 30 minutos após o término
    const endWithGracePeriod = new Date(endDateTime.getTime() + 30 * 60 * 1000);
    
    return now >= startDateTime && now <= endWithGracePeriod;
  };

  const isAvailable = isWithinLessonTime();

  // Limpar código (apenas números)
  const cleanCode = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  // Formatar código para exibição (XXX-XXX)
  const formatCode = (value: string): string => {
    const cleaned = cleanCode(value);
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
  };

  // Atualizar input de código
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value);
    setPasswordFormat(formatted);
    setCode(cleanCode(formatted));

    // Limpar mensagem de erro ao digitar
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Marcar presença (sem código necessário)
  const handleMarkAttendance = async () => {
    if (hasAttendance) {
      setModalState('already_marked');
      return;
    }

    if (!isAvailable) {
      setErrorMessage('Você está fora do horário da aula');
      return;
    }

    setIsLoading(true);
    setModalState('validating');

    try {
      // Registrar presença sem validação de código
      await api.post(`/presencas`, {
        lessonId: lesson.id,
        userId: userId,
        isPresent: true,
      });

      setModalState('success');
      toast.success('Presença marcada com sucesso!');
      
      // Invalidar queries de aulas para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['student-classes'] });

      // Fechar modal após sucesso
      setTimeout(() => {
        setCode('');
        setPasswordFormat('');
        setModalState('initial');
        setErrorMessage('');
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error: any) {
      setModalState('error');
      const errorMsg = error.response?.data?.message || 'Falha ao registrar presença';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Validar e marcar presença com código
  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setErrorMessage('Código deve ter 6 dígitos');
      return;
    }

    if (hasAttendance) {
      setModalState('already_marked');
      return;
    }

    if (!isAvailable) {
      setErrorMessage('Você está fora do horário da aula');
      return;
    }

    setIsLoading(true);
    setModalState('validating');

    try {
      // Registrar presença com código de validação
      await api.post(`/presencas`, {
        lessonId: lesson.id,
        userId: userId,
        isPresent: true,
        attendancePassword: code,
      });

      setModalState('success');
      toast.success('Presença marcada com sucesso!');
      
      // Invalidar queries de aulas para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['student-classes'] });

      // Fechar modal após sucesso
      setTimeout(() => {
        setCode('');
        setPasswordFormat('');
        setModalState('initial');
        setErrorMessage('');
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error: any) {
      setModalState('error');
      const errorMsg = error.response?.data?.message || 'Código inválido ou expirado';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setPasswordFormat('');
      setModalState(hasAttendance ? 'already_marked' : 'initial');
      setErrorMessage('');
    }
  }, [isOpen, hasAttendance]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="modal modal-open">
        <div className="modal-box max-w-md relative z-50 bg-white dark:bg-base-100 rounded-2xl shadow-lg p-0 overflow-hidden">
          {/* Header - Branco/Cinza Claro */}
          {(modalState === 'initial' || modalState === 'asking-code') && (
            <div className="border-b border-gray-100 dark:border-base-content/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                    {lesson.name || 'Registrar Presença'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {lesson.class?.code || 'Turma'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200 disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Estado: Inicial - Botão Marcar Presença */}
            {modalState === 'initial' && (
              <div className="space-y-6">
                {/* Info da Aula */}
                <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-base-content/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDateBR(lesson.date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Horário:</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {lesson.startTime.substring(11, 16)} - {lesson.endTime.substring(11, 16)}
                    </span>
                  </div>
                </div>

                {/* Mensagem de Disponibilidade */}
                {!isAvailable && (
                  <div className="bg-gray-50 dark:bg-base-200 border border-gray-200 dark:border-base-content/20 rounded-lg p-4 flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Fora do horário da aula</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        A presença só pode ser marcada durante o horário da aula.
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão Marcar Presença */}
                {isAvailable && (
                  <button
                    onClick={handleMarkAttendance}
                    disabled={isLoading}
                    className="btn w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Marcar Presença
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Estado: Pedindo Código */}
            {modalState === 'asking-code' && (
              <div className="space-y-6">
                {/* Info da Aula */}
                <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-base-content/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDateBR(lesson.date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Horário:</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {lesson.startTime.substring(11, 16)} - {lesson.endTime.substring(11, 16)}
                    </span>
                  </div>
                </div>

                {/* Form de Código */}
                <form onSubmit={handleSubmitCode} className="space-y-5">
                  {/* Input do Código */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Código de Presença
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000-000"
                      value={passwordFormat}
                      onChange={handleCodeChange}
                      maxLength={7}
                      disabled={isLoading}
                      className="input input-bordered w-full bg-white dark:bg-base-200 text-center text-3xl font-mono tracking-widest font-bold text-gray-900 dark:text-white border-gray-300 dark:border-base-content/20 disabled:opacity-50"
                    />
                    {errorMessage && (
                      <p className="text-sm text-red-600 dark:text-red-500 mt-2 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Botão Confirmar */}
                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="btn w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Confirmar Presença
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Estado: Já Marcada */}
            {modalState === 'already_marked' && (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <FiCheck className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Presença Já Marcada
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Você já registrou presença nesta aula.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn btn-ghost w-full"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* Estado: Sucesso */}
            {modalState === 'success' && (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <FiCheck className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Presença Marcada!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Sua presença foi registrada com sucesso.
                  </p>
                </div>
              </div>
            )}

            {/* Estado: Erro */}
            {modalState === 'error' && (
              <div className="text-center space-y-4 py-6">
                <div className="flex justify-center">
                  <FiAlertCircle className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Erro ao Validar
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalState('initial');
                    setErrorMessage('');
                    setCode('');
                    setPasswordFormat('');
                  }}
                  className="btn w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white border-0 font-semibold"
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

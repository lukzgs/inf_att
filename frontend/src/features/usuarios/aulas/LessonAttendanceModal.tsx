import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';
import { formatDateBR } from '@/utils/format';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Formata hora para exibição usando o timezone de Brasília
 * Mesma lógica usada em LessonCard.tsx
 */
const formatTime = (timeStr: string) => {
  if (!timeStr) return '00:00';
  
  // Se for ISO datetime (1970-01-01THH:mm:ss.000Z), extrai HH:mm diretamente
  // (já está em Brasília, sem necessidade de conversão)
  if (timeStr.includes('T')) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  }
  
  // Se já for HH:mm, retorna como está
  if (timeStr.length === 5 && timeStr.includes(':')) {
    return timeStr;
  }
  
  // Fallback
  return timeStr.substring(0, 5);
};

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

  // Verificar presença do aluno na aula ao abrir o modal
  useEffect(() => {
    if (!isOpen || !userId || !lesson.id) {
      return;
    }

    const checkAttendance = async () => {
      try {
        console.log(`🔍 [LessonAttendanceModal] Verificando presença: userId=${userId}, lessonId=${lesson.id}`);
        const response = await api.get(`/presencas?userId=${userId}&lessonId=${lesson.id}`);
        console.log(`📋 [LessonAttendanceModal] Resposta do servidor:`, response.data);
        
        // Se retornar array com algum item, significa que existe presença
        if (Array.isArray(response.data) && response.data.length > 0) {
          const attendance = response.data[0];
          console.log(`📌 [LessonAttendanceModal] Presença encontrada: isPresent=${attendance.isPresent}`);
          
          // Se já marcou como PRESENTE, mostra "Já Marcada"
          if (attendance.isPresent === true) {
            setModalState('already_marked');
          } else {
            // Se marcado como AUSENTE, permite que marque como presente
            setModalState('initial');
          }
        } else {
          // Nenhuma presença encontrada - permite marcar
          setModalState('initial');
        }
      } catch (error: any) {
        console.error(`❌ [LessonAttendanceModal] Erro ao verificar presença:`, error.response?.data || error.message);
        setModalState('initial');
      }
    };

    checkAttendance();
  }, [isOpen, userId, lesson.id]);

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
    
    // Extrair horários usando a função formatTime
    const startTimeStr = formatTime(lesson.startTime);
    const endTimeStr = formatTime(lesson.endTime);
    
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
    
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
    if (!isAvailable) {
      setErrorMessage('Você está fora do horário da aula');
      return;
    }

    setIsLoading(true);
    setModalState('validating');

    try {
      // ⚠️ VERIFICAÇÃO FINAL: Confere se presença já não foi criada como PRESENTE
      // (pode ter sido criada em outra aba/dispositivo)
      const checkResponse = await api.get(`/presencas?userId=${userId}&lessonId=${lesson.id}`);
      const attendanceExists = Array.isArray(checkResponse.data) && checkResponse.data.length > 0 ? checkResponse.data[0] : null;
      
      // Se já marcou como PRESENTE, bloqueia
      if (attendanceExists && attendanceExists.isPresent === true) {
        setModalState('already_marked');
        setIsLoading(false);
        return;
      }

      // Se existe como AUSENTE, EDITA para PRESENTE
      // Se não existe, CRIA como PRESENTE
      if (attendanceExists && attendanceExists.isPresent === false) {
        console.log(`📝 [LessonAttendanceModal] Editando presença de ausente para presente`);
        // EDITAR usando PATCH
        await api.patch(`/presencas/${lesson.id}/${userId}`, {
          isPresent: true,
        });
      } else {
        console.log(`➕ [LessonAttendanceModal] Criando nova presença`);
        // CRIAR usando POST
        await api.post(`/presencas`, {
          lessonId: lesson.id,
          userId: userId,
          isPresent: true,
        });
      }

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

    if (!isAvailable) {
      setErrorMessage('Você está fora do horário da aula');
      return;
    }

    setIsLoading(true);
    setModalState('validating');

    try {
      // ⚠️ VERIFICAÇÃO FINAL: Confere se presença já não foi criada como PRESENTE
      const checkResponse = await api.get(`/presencas?userId=${userId}&lessonId=${lesson.id}`);
      const attendanceExists = Array.isArray(checkResponse.data) && checkResponse.data.length > 0 ? checkResponse.data[0] : null;
      
      // Se já marcou como PRESENTE, bloqueia
      if (attendanceExists && attendanceExists.isPresent === true) {
        setModalState('already_marked');
        setIsLoading(false);
        return;
      }

      // Se existe como AUSENTE, EDITA para PRESENTE
      // Se não existe, CRIA como PRESENTE
      if (attendanceExists && attendanceExists.isPresent === false) {
        console.log(`📝 [LessonAttendanceModal] Editando presença de ausente para presente (com código)`);
        // EDITAR usando PATCH
        await api.patch(`/presencas/${lesson.id}/${userId}`, {
          isPresent: true,
          attendancePassword: code,
        });
      } else {
        console.log(`➕ [LessonAttendanceModal] Criando nova presença (com código)`);
        // CRIAR usando POST
        await api.post(`/presencas`, {
          lessonId: lesson.id,
          userId: userId,
          isPresent: true,
          attendancePassword: code,
        });
      }

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

  // Reset dos inputs quando modal é aberto (mas NÃO reseta modalState)
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setPasswordFormat('');
      setErrorMessage('');
    }
  }, [isOpen]);

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
        <div className="modal-box max-w-2xl relative z-50 bg-white dark:bg-base-100 rounded-2xl shadow-2xl p-0 overflow-hidden">
          {/* Header com Título e Data/Hora */}
          <div className="border-b border-gray-200 dark:border-base-content/10 px-8 py-6 flex items-start justify-between">
            <div>
              <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                Aula
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDateBR(lesson.date)} • {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
              </p>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200 disabled:opacity-50"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Estado: Inicial - Botão Marcar Presença */}
            {modalState === 'initial' && (
              <div className="space-y-8">
                {/* Seção: Informações da Aula */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiCalendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Informações da Aula
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-base-200/50 border border-gray-200 dark:border-base-content/10 rounded-xl p-6 space-y-4">
                    {/* Data */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Data
                      </label>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                        {formatDateBR(lesson.date)}
                      </p>
                    </div>

                    {/* Horário */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Início
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {formatTime(lesson.startTime)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Término
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {formatTime(lesson.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Turma/Subject */}
                    {lesson.class?.code && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Turma
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {lesson.class.code}
                          {lesson.class?.subject?.name && ` - ${lesson.class.subject.name}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensagem de Disponibilidade ou Botão */}
                {!isAvailable && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-5 flex items-start gap-4">
                    <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900 dark:text-red-400">Fora do Horário da Aula</p>
                      <p className="text-sm text-red-800 dark:text-red-300/80 mt-1">
                        A presença só pode ser marcada durante a aula ou até 30 minutos após o término.
                      </p>
                    </div>
                  </div>
                )}

                {isAvailable && (
                  <button
                    onClick={handleMarkAttendance}
                    disabled={isLoading}
                    className="btn w-full py-3 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base h-auto"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Marcar Presença
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Estado: Pedindo Código */}
            {modalState === 'asking-code' && (
              <div className="space-y-8">
                {/* Seção: Informações da Aula */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiCalendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Informações da Aula
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-base-200/50 border border-gray-200 dark:border-base-content/10 rounded-xl p-6 space-y-4">
                    {/* Data */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Data
                      </label>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                        {formatDateBR(lesson.date)}
                      </p>
                    </div>

                    {/* Horário */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Início
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {formatTime(lesson.startTime)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Término
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {formatTime(lesson.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Turma/Subject */}
                    {lesson.class?.code && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Turma
                        </label>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                          {lesson.class.code}
                          {lesson.class?.subject?.name && ` - ${lesson.class.subject.name}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seção: Código de Presença */}
                <form onSubmit={handleSubmitCode} className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 dark:text-white block mb-3">
                      Digite o Código de Presença
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000-000"
                      value={passwordFormat}
                      onChange={handleCodeChange}
                      maxLength={7}
                      disabled={isLoading}
                      className="input input-bordered w-full bg-white dark:bg-base-200 text-center text-5xl font-mono tracking-widest font-bold text-gray-900 dark:text-white border-2 border-gray-300 dark:border-base-content/20 focus:border-primary dark:focus:border-primary disabled:opacity-50 py-6 h-auto"
                      autoFocus
                    />
                    {errorMessage && (
                      <p className="text-sm text-red-600 dark:text-red-500 mt-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Botão Confirmar */}
                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="btn w-full py-3 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base h-auto"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Confirmar Presença
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Estado: Já Marcada */}
            {modalState === 'already_marked' && (
              <div className="py-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                      <FiCheck className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      Presença Já Marcada
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Você já registrou presença nesta aula.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="btn btn-ghost w-full font-semibold"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {/* Estado: Sucesso */}
            {modalState === 'success' && (
              <div className="py-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                      <FiCheck className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      Presença Marcada!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Sua presença foi registrada com sucesso.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Estado: Erro */}
            {modalState === 'error' && (
              <div className="py-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                      <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      Erro ao Validar
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

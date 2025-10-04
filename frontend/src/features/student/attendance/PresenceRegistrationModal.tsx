import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useLessons } from '@/hooks/useLessons';
import { validatePresenceCode, formatPresenceCode, cleanPresenceCode } from '@/utils/validation/validateCode';
import { formatTimeRemaining } from '@/utils/date/getTimeRemaining';
import { canRegisterAttendance } from '@/utils/date/isWithinTimeWindow';
import { addMinutes } from '@/utils/date/isWithinTimeWindow';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { FiCheck, FiAlertCircle, FiClock } from 'react-icons/fi';

/**
 * Props do PresenceRegistrationModal
 */
export interface PresenceRegistrationModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback ao fechar o modal */
  onClose: () => void;
}

/**
 * Estados possíveis do modal
 */
type ModalState = 'input' | 'validating' | 'success' | 'error';

/**
 * Modal para registro de presença do aluno
 * 
 * Funcionalidades:
 * - Input de código de 6 dígitos com formatação automática
 * - Validação real-time do código
 * - Timer countdown (janela de 20 minutos)
 * - Estados visuais: idle, validating, success, error
 * - Lista de aulas abertas no momento
 * - POST /presencas após validação
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <PresenceRegistrationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export function PresenceRegistrationModal({
  isOpen,
  onClose,
}: PresenceRegistrationModalProps) {
  const { user } = useAuth();
  const { data: allLessons } = useLessons();
  const queryClient = useQueryClient();

  // Estados
  const [code, setCode] = useState('');
  const [modalState, setModalState] = useState<ModalState>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Filtrar apenas aulas abertas
  const openLessons = allLessons?.filter(lesson => lesson.isOpen) || [];

  // Atualizar timer a cada segundo
  useEffect(() => {
    if (!isOpen || openLessons.length === 0) return;

    const interval = setInterval(() => {
      const lesson = openLessons[0];
      if (lesson.openedAt) {
        const endTime = addMinutes(new Date(lesson.openedAt), 20);
        setTimeRemaining(formatTimeRemaining(endTime));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, openLessons]);

  // Reset ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setModalState('input');
      setErrorMessage('');
      setSelectedLesson(openLessons[0]?.id || null);
    }
  }, [isOpen, openLessons]);

  // Validação real-time do código
  const handleCodeChange = (value: string) => {
    const cleaned = cleanPresenceCode(value);
    
    // Limitar a 6 dígitos
    if (cleaned.length <= 6) {
      setCode(cleaned);
      setErrorMessage('');
    }
  };

  // Submeter código
  const handleSubmit = async () => {
    if (!user || !selectedLesson) return;

    // Validar código
    const isValid = validatePresenceCode(code);
    if (!isValid) {
      setErrorMessage('Código inválido. Digite 6 dígitos numéricos.');
      return;
    }

    // Verificar janela de tempo
    const lesson = openLessons.find(l => l.id === selectedLesson);
    if (!lesson || !lesson.openedAt) {
      setErrorMessage('Aula não encontrada ou não está aberta');
      return;
    }

    const canRegister = canRegisterAttendance(new Date(lesson.openedAt), 20);
    if (!canRegister) {
      setErrorMessage('Tempo para registro expirado (20 minutos)');
      setModalState('error');
      return;
    }

    // Registrar presença
    setModalState('validating');
    
    try {
      // TODO: Quando backend tiver endpoint específico com validação de código,
      // usar POST /presencas/register-with-code
      // Por enquanto, usando endpoint padrão
      await api.post('/presencas', {
        lessonId: selectedLesson,
        userId: user.id,
        isPresent: true,
        // code: code, // Adicionar quando backend aceitar
      });

      setModalState('success');

      // Invalidar cache para atualizar dashboard
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['student-classes'] });
        queryClient.invalidateQueries({ queryKey: ['attendances'] });
        
        // Fechar após 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 1000);

    } catch (error: any) {
      console.error('Erro ao registrar presença:', error);
      setModalState('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Erro ao registrar presença. Código pode estar incorreto.'
      );
    }
  };

  // Formatar código para exibição (123 456)
  const displayCode = formatPresenceCode(code);

  // Renderizar conteúdo baseado no estado
  const renderContent = () => {
    switch (modalState) {
      case 'validating':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/70">Validando código...</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <FiCheck className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-success">Presença Registrada!</h3>
            <p className="text-base-content/70 text-center">
              Sua presença foi confirmada com sucesso.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <FiAlertCircle className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-xl font-bold text-error">Erro ao Registrar</h3>
            <p className="text-base-content/70 text-center">
              {errorMessage || 'Não foi possível registrar sua presença.'}
            </p>
            <button
              onClick={() => {
                setModalState('input');
                setCode('');
                setErrorMessage('');
              }}
              className="btn btn-primary mt-4"
            >
              Tentar Novamente
            </button>
          </div>
        );

      default: // 'input'
        return (
          <div className="space-y-6">
            {/* Verificar se há aulas abertas */}
            {openLessons.length === 0 ? (
              <div className="alert alert-warning">
                <FiAlertCircle className="w-5 h-5" />
                <span>Nenhuma aula aberta no momento. Aguarde o professor abrir a aula.</span>
              </div>
            ) : (
              <>
                {/* Aula selecionada */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Aula Aberta:</h4>
                  <p className="text-sm">
                    {openLessons[0].class?.subject?.name || 'Disciplina'}
                  </p>
                  <p className="text-xs text-base-content/70 mt-1">
                    Turma: {openLessons[0].class?.code}
                  </p>
                </div>

                {/* Timer */}
                {timeRemaining && (
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <FiClock className="w-4 h-4" />
                    <span>Tempo restante: <strong>{timeRemaining}</strong></span>
                  </div>
                )}

                {/* Input de código */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Digite o código da aula:</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123 456"
                    value={displayCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && code.length === 6) {
                        handleSubmit();
                      }
                    }}
                    className={`input input-bordered w-full text-center text-2xl font-mono tracking-widest ${
                      errorMessage ? 'input-error' : ''
                    }`}
                    maxLength={7} // 6 dígitos + 1 espaço
                    autoFocus
                  />
                  {errorMessage && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errorMessage}</span>
                    </label>
                  )}
                </div>

                {/* Instruções */}
                <div className="text-sm text-base-content/70 bg-base-200 rounded-lg p-3">
                  <p className="font-semibold mb-1">📝 Instruções:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Digite o código de 6 dígitos fornecido pelo professor</li>
                    <li>Você tem até 20 minutos após a abertura da aula</li>
                    <li>O código só pode ser usado uma vez</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalState === 'input' ? 'Registrar Presença' : ''}
      size="md"
      closeOnClickOutside={modalState === 'input'}
      closeOnEscape={modalState === 'input'}
      showCloseButton={modalState !== 'validating'}
      footer={
        modalState === 'input' && openLessons.length > 0 ? (
          <div className="flex gap-2 w-full">
            <button
              onClick={onClose}
              className="btn btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={code.length !== 6}
              className="btn btn-primary flex-1"
            >
              Confirmar
            </button>
          </div>
        ) : undefined
      }
    >
      {renderContent()}
    </Modal>
  );
}

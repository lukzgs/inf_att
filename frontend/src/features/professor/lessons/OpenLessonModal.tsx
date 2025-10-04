import { useEffect, useState, useRef } from 'react';
import { FiX, FiClock, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { useOpenLesson, useCloseLesson } from '@/hooks/useLessonActions';
import { formatSecondsToMMSS, formatPresenceCode } from '@/utils/presenceCode';
import RealTimeAttendanceList from './RealTimeAttendanceList';
import { toast } from 'sonner';

interface OpenLessonModalProps {
  /** ID da aula a ser aberta */
  lessonId: number;
  /** Nome/código da turma */
  className: string;
  /** Data da aula (para exibição) */
  lessonDate: string;
  /** Total de alunos matriculados na turma */
  totalStudents: number;
  /** Callback ao fechar modal */
  onClose: () => void;
  /** Callback ao abrir aula com sucesso */
  onLessonOpened?: (presenceCode: string) => void;
  /** Callback ao fechar aula com sucesso */
  onLessonClosed?: () => void;
}

/**
 * OpenLessonModal - Modal para abrir e gerenciar aula em tempo real
 * 
 * Features:
 * - Exibe código de presença grande (6 dígitos)
 * - Contador regressivo de 20 minutos
 * - Botão de copiar código
 * - Lista de alunos presentes em tempo real (via polling)
 * - Botão de fechar aula manualmente
 * - Fecha automaticamente após 20 minutos
 * - Estados: opening, open, closing
 * 
 * @example
 * ```tsx
 * <OpenLessonModal
 *   lessonId={123}
 *   className="CC0001 - Programação I"
 *   lessonDate="2025-10-04"
 *   onClose={() => setShowModal(false)}
 *   onLessonOpened={(code) => console.log('Código:', code)}
 * />
 * ```
 */
export default function OpenLessonModal({
  lessonId,
  className,
  lessonDate,
  totalStudents,
  onClose,
  onLessonOpened,
  onLessonClosed,
}: OpenLessonModalProps) {
  const [presenceCode, setPresenceCode] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(20 * 60); // 20 minutos em segundos
  const [lessonState, setLessonState] = useState<'opening' | 'open' | 'closing'>('opening');
  const [showCopied, setShowCopied] = useState(false);

  const { mutate: openLesson } = useOpenLesson();
  const { mutate: closeLesson, isPending: isClosing } = useCloseLesson();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Abrir aula automaticamente ao montar o componente
  useEffect(() => {
    openLesson(lessonId, {
      onSuccess: (data) => {
        setPresenceCode(data.presenceCode);
        setLessonState('open');
        onLessonOpened?.(data.presenceCode);
      },
      onError: () => {
        // Se falhar ao abrir, fecha o modal
        onClose();
      },
    });
  }, [lessonId]);

  // Timer countdown
  useEffect(() => {
    if (lessonState !== 'open') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Tempo esgotado - fechar aula automaticamente
          handleCloseLesson();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lessonState]);

  const handleCloseLesson = () => {
    setLessonState('closing');
    closeLesson(lessonId, {
      onSuccess: () => {
        onLessonClosed?.();
        onClose();
      },
      onError: () => {
        setLessonState('open'); // Volta para aberto se falhar
      },
    });
  };

  const handleCopyCode = () => {
    if (!presenceCode) return;
    
    navigator.clipboard.writeText(presenceCode);
    setShowCopied(true);
    toast.success('Código copiado!', {
      description: 'Código de presença copiado para a área de transferência',
    });
    
    setTimeout(() => setShowCopied(false), 2000);
  };

  const timePercentage = ((20 * 60 - timeRemaining) / (20 * 60)) * 100;
  const isTimeRunningOut = timeRemaining < 5 * 60; // Menos de 5 minutos

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost hover:bg-white/20"
            disabled={lessonState === 'opening' || lessonState === 'closing'}
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Aula Aberta</h2>
              <p className="text-white/80">{className}</p>
            </div>
          </div>

          <p className="text-sm text-white/70">
            {new Date(lessonDate).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Loading State */}
        {lessonState === 'opening' && (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-lg font-medium text-gray-700 dark:text-base-content">
              Abrindo aula...
            </p>
            <p className="text-sm text-gray-500 dark:text-base-content/70">
              Gerando código de presença
            </p>
          </div>
        )}

        {/* Open State */}
        {lessonState === 'open' && presenceCode && (
          <div className="p-6 space-y-6">
            {/* Presence Code Display */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-base-content/70 mb-2">
                Código de Presença
              </p>
              <div className="relative inline-block">
                <div className="text-7xl font-bold tracking-wider text-primary bg-primary/10 px-12 py-6 rounded-2xl border-4 border-primary/30">
                  {formatPresenceCode(presenceCode)}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="absolute -top-3 -right-3 btn btn-circle btn-primary shadow-lg hover:scale-110 transition-transform"
                >
                  {showCopied ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    <FiCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-base-content/70 mt-3">
                Os alunos devem inserir este código para registrar presença
              </p>
            </div>

            {/* Timer */}
            <div className="premium-card">
              <div className="premium-card-body">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiClock className={`w-5 h-5 ${isTimeRunningOut ? 'text-error' : 'text-gray-600'}`} />
                    <span className="font-medium text-gray-700 dark:text-base-content">
                      Tempo Restante
                    </span>
                  </div>
                  <span className={`text-3xl font-bold tabular-nums ${
                    isTimeRunningOut ? 'text-error animate-pulse' : 'text-primary'
                  }`}>
                    {formatSecondsToMMSS(timeRemaining)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-gray-200 dark:bg-base-300 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full transition-all duration-1000 ${
                      isTimeRunningOut ? 'bg-error' : 'bg-success'
                    }`}
                    style={{ width: `${100 - timePercentage}%` }}
                  />
                </div>

                {isTimeRunningOut && (
                  <p className="text-sm text-error font-medium mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                    Atenção: A aula será fechada automaticamente em breve
                  </p>
                )}
              </div>
            </div>

            {/* Real-Time Attendance List */}
            <div className="premium-card">
              <div className="premium-card-body">
                <RealTimeAttendanceList
                  lessonId={lessonId}
                  totalStudents={totalStudents}
                  enabled={lessonState === 'open'}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-base-300">
              <button
                onClick={handleCloseLesson}
                disabled={isClosing}
                className="btn btn-error flex-1"
              >
                {isClosing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Fechando...
                  </>
                ) : (
                  'Fechar Aula'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Closing State */}
        {lessonState === 'closing' && (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-error mb-4"></span>
            <p className="text-lg font-medium text-gray-700 dark:text-base-content">
              Fechando aula...
            </p>
            <p className="text-sm text-gray-500 dark:text-base-content/70">
              Registrando faltas automáticas
            </p>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

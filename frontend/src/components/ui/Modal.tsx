import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Tamanhos disponíveis para o modal
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Props do componente Modal
 */
export interface ModalProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback ao fechar o modal */
  onClose: () => void;
  /** Título do modal */
  title?: string;
  /** Conteúdo do modal */
  children: ReactNode;
  /** Tamanho do modal */
  size?: ModalSize;
  /** Se deve fechar ao clicar fora */
  closeOnClickOutside?: boolean;
  /** Se deve fechar ao pressionar ESC */
  closeOnEscape?: boolean;
  /** Se deve mostrar o botão de fechar (X) */
  showCloseButton?: boolean;
  /** Classe CSS adicional para o container do modal */
  className?: string;
  /** Se deve mostrar o footer */
  footer?: ReactNode;
}

/**
 * Mapa de tamanhos para classes Tailwind
 */
const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full m-4',
};

/**
 * Componente Modal reutilizável
 * 
 * Features:
 * - Overlay com backdrop blur
 * - Fecha com ESC
 * - Fecha ao clicar fora
 * - Múltiplos tamanhos (sm, md, lg, xl, full)
 * - Integração com DaisyUI
 * - Acessível (ARIA)
 * - Previne scroll do body quando aberto
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar Ação"
 *   size="md"
 * >
 *   <p>Tem certeza que deseja continuar?</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fecha ao clicar fora
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`
          modal-box relative w-full ${sizeClasses[size]} 
          bg-base-100 shadow-xl rounded-lg
          animate-fade-in
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 id="modal-title" className="text-lg font-bold">
                {title}
              </h3>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-action">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Modal de confirmação (variante do Modal)
 * 
 * @example
 * ```tsx
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => handleDelete()}
 *   title="Confirmar Exclusão"
 *   message="Tem certeza que deseja excluir este item?"
 *   confirmText="Excluir"
 *   confirmType="error"
 * />
 * ```
 */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'success' | 'warning' | 'error';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmType = 'primary',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="btn btn-ghost flex-1"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`btn btn-${confirmType} flex-1`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-base-content/70">{message}</p>
    </Modal>
  );
}

/**
 * Modal de loading (variante do Modal)
 * 
 * @example
 * ```tsx
 * <LoadingModal
 *   isOpen={isLoading}
 *   message="Carregando dados..."
 * />
 * ```
 */
export interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingModal({
  isOpen,
  message = 'Carregando...',
}: LoadingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      size="sm"
      closeOnClickOutside={false}
      closeOnEscape={false}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/70">{message}</p>
      </div>
    </Modal>
  );
}

import * as React from 'react';
import type { ReactNode } from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  children?: ReactNode;
}

const variantConfig = {
  danger: {
    icon: FiXCircle,
    iconClass: 'text-error',
    confirmClass: 'btn-error',
  },
  warning: {
    icon: FiAlertTriangle,
    iconClass: 'text-warning',
    confirmClass: 'btn-warning',
  },
  info: {
    icon: FiInfo,
    iconClass: 'text-info',
    confirmClass: 'btn-info',
  },
  success: {
    icon: FiCheckCircle,
    iconClass: 'text-success',
    confirmClass: 'btn-success',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
  loading = false,
  children,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar:', error);
    }
  };

  // Fechar com ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? "confirm-dialog-description" : undefined}
      >
        <div className="modal-box max-w-md bg-base-100 shadow-xl">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 ${config.iconClass}`}>
              <Icon size={32} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 
                id="confirm-dialog-title" 
                className="font-bold text-lg"
              >
                {title}
              </h3>
              {description && (
                <p 
                  id="confirm-dialog-description" 
                  className="text-base-content/70 mt-2"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Custom Content */}
          {children && (
            <div className="py-4">
              {children}
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
              aria-label={cancelText}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`btn ${config.confirmClass}`}
              disabled={loading}
              aria-label={confirmText}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
                  <span className="sr-only">Processando...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook para facilitar o uso
export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    props: Omit<ConfirmDialogProps, 'isOpen' | 'onClose'>;
  }>({
    isOpen: false,
    props: {
      onConfirm: () => {},
      title: '',
    },
  });

  const confirm = (props: Omit<ConfirmDialogProps, 'isOpen' | 'onClose'>) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm();
            resolve(true);
          },
        },
      });
    });
  };

  const close = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmDialog: state.isOpen ? (
      <ConfirmDialog
        {...state.props}
        isOpen={state.isOpen}
        onClose={close}
      />
    ) : null,
    confirm,
  };
}

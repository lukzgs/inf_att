import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'btn-error',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-center mb-2">{title}</h3>

        {/* Message */}
        <p className="text-center text-base-content/70 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`btn ${confirmButtonClass} ${isLoading ? 'loading' : ''}`}
          >
            {!isLoading && confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}

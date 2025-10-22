import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
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
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="modal modal-open">
        <div className="modal-box max-w-md relative z-50 bg-white dark:bg-base-100 rounded-2xl shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6 pt-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-2xl text-center mb-3 text-gray-900 dark:text-white">{title}</h3>

          {/* Message */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 justify-center pb-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg font-medium text-sm bg-gray-100 dark:bg-base-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-300 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg font-medium text-sm bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <span className="loading loading-spinner loading-sm"></span>}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

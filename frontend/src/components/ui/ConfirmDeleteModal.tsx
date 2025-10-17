import { FiTrash2, FiX } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de Confirmação para Deleção
 * 
 * Features:
 * - Design premium com cores de alerta
 * - Ícone de lixeira destacado
 * - Dois botões: Cancelar e Deletar
 * - Suporte a dark mode
 * - Fecha com ESC
 * - Fecha ao clicar fora
 * - Loading state durante deleção
 */
export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onCancel]);

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
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      ref={modalRef}
    >
      <div className="bg-white dark:bg-base-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-base-300 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Header com ícone */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Ícone de Lixeira */}
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
              <FiTrash2 className="w-6 h-6 text-error" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>

          {/* Botão Fechar (X) */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-base-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Fechar"
          >
            <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Highlight do Item a Deletar */}
        <div className="px-6 py-3 bg-error/5 dark:bg-error/10 border-t border-b border-error/20 dark:border-error/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">
            Item a deletar:
          </p>
          <p className="text-base font-bold text-error dark:text-error/90 truncate">
            "{itemName}"
          </p>
        </div>

        {/* Aviso de Irreversibilidade */}
        <div className="px-6 py-4">
          <div className="flex gap-2 bg-warning/5 dark:bg-warning/10 border border-warning/20 dark:border-warning/30 rounded-lg p-3">
            <div className="text-warning text-lg flex-shrink-0">⚠️</div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Esta ação <span className="font-bold">não pode ser desfeita</span>. Todos os dados relacionados serão permanentemente removidos.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="px-6 py-4 flex gap-3 border-t border-gray-200 dark:border-base-300">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-base-200 hover:bg-gray-200 dark:hover:bg-base-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-error hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Deletando...
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                Deletar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

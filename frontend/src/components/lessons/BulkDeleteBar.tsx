import { FiTrash2, FiX } from 'react-icons/fi';

interface BulkDeleteBarProps {
  selectedCount: number;
  onCancelSelection: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function BulkDeleteBar({
  selectedCount,
  onCancelSelection,
  onDelete,
  isLoading = false,
}: BulkDeleteBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white dark:bg-base-100 rounded-full shadow-2xl border border-gray-200 dark:border-base-300 px-6 py-3 flex items-center gap-4">
        {/* Informação */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="text-primary font-bold">{selectedCount}</span>
          <span className="hidden sm:inline">
            {selectedCount === 1 ? ' aula selecionada' : ' aulas selecionadas'}
          </span>
        </div>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-300 dark:bg-base-300"></div>

        {/* Botões */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancelSelection}
            disabled={isLoading}
            className="btn btn-sm btn-ghost text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200"
          >
            <FiX className="w-4 h-4" />
            Cancelar
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            className="btn btn-sm btn-error text-white"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
            {isLoading ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>
    </div>
  );
}

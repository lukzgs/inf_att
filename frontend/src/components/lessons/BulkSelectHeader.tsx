interface BulkSelectHeaderProps {
  totalLessons: number;
  selectedCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onShowSelectMode: (show: boolean) => void;
  showSelectMode: boolean;
}

export function BulkSelectHeader({
  totalLessons,
  selectedCount,
  isAllSelected,
  onToggleSelectAll,
  onShowSelectMode,
  showSelectMode,
}: BulkSelectHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-base-content/10 pb-2 inline-block">
          Aulas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {totalLessons} aula{totalLessons !== 1 ? 's' : ''} cadastrada{totalLessons !== 1 ? 's' : ''}
        </p>
      </div>

      {showSelectMode && totalLessons > 0 && (
        <div className="flex items-center gap-3">
          {/* Checkbox Selecionar Tudo */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCount > 0 ? `${selectedCount} selecionada${selectedCount !== 1 ? 's' : ''}` : 'Selecionar tudo'}
            </span>
          </label>

          {/* Botão para sair do modo seleção */}
          <button
            onClick={() => onShowSelectMode(false)}
            className="btn btn-sm btn-ghost text-gray-600 dark:text-gray-400"
          >
            ✕ Cancelar
          </button>
        </div>
      )}

      {!showSelectMode && totalLessons > 0 && (
        <button
          onClick={() => onShowSelectMode(true)}
          className="btn btn-sm btn-outline btn-primary"
        >
          📋 Selecionar
        </button>
      )}
    </div>
  );
}

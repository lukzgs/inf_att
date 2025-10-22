interface BulkSelectHeaderProps {
  totalLessons: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onShowSelectMode: (show: boolean) => void;
  showSelectMode: boolean;
}

export function BulkSelectHeader({
  totalLessons,
  isAllSelected,
  onToggleSelectAll,
  onShowSelectMode,
  showSelectMode,
}: BulkSelectHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-base-content/10 pb-2 inline-block">
          Aulas
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
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
              className="checkbox checkbox-sm checked:bg-primary checked:border-primary border border-gray-400 dark:border-gray-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selecionar tudo
            </span>
          </label>
        </div>
      )}

      {!showSelectMode && totalLessons > 0 && (
        <button
          onClick={() => onShowSelectMode(true)}
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          Selecionar
        </button>
      )}
    </div>
  );
}

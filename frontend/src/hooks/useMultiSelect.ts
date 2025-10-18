import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar seleção múltipla de itens
 */
export const useMultiSelect = <T extends { id: number }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleItem = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: number) => selectedIds.has(id),
    [selectedIds]
  );

  const getSelectedItems = useCallback(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const hasSelection = selectedIds.size > 0;

  return {
    selectedIds,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    getSelectedItems,
    isAllSelected,
    hasSelection,
    selectionCount: selectedIds.size,
  };
};

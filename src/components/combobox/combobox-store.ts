import type { ActiveMoveDirection, ComboboxActiveStore, ComboboxItemData } from "./types.js";

export function createComboboxActiveStore(): ComboboxActiveStore {
  let activeId: string | null = null;
  const listeners = new Set<() => void>();
  const itemListeners = new Map<string, Set<() => void>>();

  const emitItem = (id: string) => {
    itemListeners.get(id)?.forEach((listener) => listener());
  };

  return {
    getActiveId: () => activeId,
    isActive(id: string) {
      return activeId === id;
    },
    setActiveId(next: string | null) {
      if (activeId === next) return;
      const previous = activeId;
      activeId = next;
      listeners.forEach((listener) => listener());
      if (previous) emitItem(previous);
      if (next) emitItem(next);
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeItem(id: string, listener: () => void) {
      const set = itemListeners.get(id) ?? new Set<() => void>();
      set.add(listener);
      itemListeners.set(id, set);
      return () => {
        set.delete(listener);
        if (set.size === 0) itemListeners.delete(id);
      };
    },
  };
}

export function moveActiveId(
  orderedIds: readonly string[],
  activeId: string | null,
  direction: ActiveMoveDirection,
): string | null {
  if (orderedIds.length === 0) return null;

  const currentIndex = activeId ? orderedIds.indexOf(activeId) : -1;

  switch (direction) {
    case "first":
      return orderedIds[0] ?? null;
    case "last":
      return orderedIds[orderedIds.length - 1] ?? null;
    case "next": {
      if (currentIndex < 0) return orderedIds[0] ?? null;
      return orderedIds[Math.min(currentIndex + 1, orderedIds.length - 1)] ?? null;
    }
    case "prev": {
      if (currentIndex < 0) return orderedIds[orderedIds.length - 1] ?? null;
      return orderedIds[Math.max(currentIndex - 1, 0)] ?? null;
    }
  }
}

export function defaultComboboxFilter(
  items: readonly ComboboxItemData[],
  inputValue: string,
): ComboboxItemData[] {
  const query = inputValue.trim().toLowerCase();
  if (!query) return [...items];
  return items.filter((item) => item.label.toLowerCase().includes(query));
}

import type { SortDescriptor, TableStore, TableStoreOptions } from "./types.js";

export function createTableStore(options: TableStoreOptions = {}): TableStore {
  const {
    defaultSelectedKeys,
    defaultSortDescriptor = null,
    selectedKeys: controlledKeys,
    sortDescriptor: controlledSort,
  } = options;

  let selectedKeys = new Set(controlledKeys ?? defaultSelectedKeys ?? []);
  let sortDescriptor: SortDescriptor | null =
    controlledSort !== undefined ? controlledSort : defaultSortDescriptor;
  let onSelectionChange = options.onSelectionChange;
  let onSortChange = options.onSortChange;
  let selectionBehavior = options.selectionBehavior ?? "toggle";
  let selectionMode = options.selectionMode ?? "none";
  let rowIds: string[] = [];
  const rowIdSet = new Set<string>();
  const disabledIds = new Set<string>();
  let lastSelectedId: string | null = null;

  const listeners = new Set<() => void>();
  const rowListeners = new Map<string, Set<() => void>>();
  const selectionListeners = new Set<() => void>();
  const sortListeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };
  const emitRow = (id: string) => {
    for (const listener of rowListeners.get(id) ?? []) listener();
  };
  const emitSelection = () => {
    for (const listener of selectionListeners) listener();
  };
  const emitSort = () => {
    for (const listener of sortListeners) listener();
  };

  const commitSelection = (next: Set<string>, notify = true) => {
    const prev = selectedKeys;
    selectedKeys = next;
    for (const id of new Set([...prev, ...next])) emitRow(id);
    emitSelection();
    emit();
    if (notify) onSelectionChange?.(selectedKeys);
  };

  const commitSort = (descriptor: SortDescriptor | null, notify = true) => {
    sortDescriptor = descriptor;
    emitSort();
    emit();
    if (notify) onSortChange?.(descriptor);
  };

  const store: TableStore = {
    getRowIds: () => rowIds,
    getSelectedKeys: () => selectedKeys,
    getSelectionState: () => {
      if (selectionMode === "none") return "none";
      const enabled = rowIds.filter((id) => !disabledIds.has(id));
      if (enabled.length === 0) return "none";
      const selectedCount = enabled.filter((id) => selectedKeys.has(id)).length;
      if (selectedCount === 0) return "none";
      if (selectedCount === enabled.length) return "all";
      return "some";
    },
    getServerSelectedSnapshot: () => new Set<string>(),
    getServerSortSnapshot: () => null,
    getSortSnapshot: () => sortDescriptor,
    isRowSelected: (id) => selectedKeys.has(id),
    registerRow(id) {
      if (!rowIdSet.has(id)) {
        rowIdSet.add(id);
        rowIds.push(id);
        if (selectionListeners.size > 0) emitSelection();
      }
      return () => {
        if (!rowIdSet.delete(id)) return;
        const index = rowIds.indexOf(id);
        if (index !== -1) rowIds.splice(index, 1);
        disabledIds.delete(id);
        emitSelection();
      };
    },
    setRowDisabled(id, disabled) {
      if (disabled === disabledIds.has(id)) return;
      if (disabled) disabledIds.add(id);
      else disabledIds.delete(id);
      emitSelection();
    },
    setRowIds(ids) {
      rowIds = [...ids];
      rowIdSet.clear();
      for (const id of rowIds) rowIdSet.add(id);
      emitSelection();
    },
    setSelectedKeys(keys) {
      commitSelection(new Set(keys));
    },
    setSortDescriptor(descriptor) {
      commitSort(descriptor);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeRow(id, listener) {
      const set = rowListeners.get(id) ?? new Set<() => void>();
      set.add(listener);
      rowListeners.set(id, set);
      return () => {
        set.delete(listener);
        if (set.size === 0) rowListeners.delete(id);
      };
    },
    subscribeSelection(listener) {
      selectionListeners.add(listener);
      return () => selectionListeners.delete(listener);
    },
    subscribeSort(listener) {
      sortListeners.add(listener);
      return () => sortListeners.delete(listener);
    },
    syncSelectedKeys(keys) {
      commitSelection(new Set(keys), false);
    },
    syncSortDescriptor(descriptor) {
      commitSort(descriptor, false);
    },
    toggleRow(id, toggleOptions = {}) {
      if (selectionMode === "none" || toggleOptions.disabled) return;

      if (selectionMode === "single") {
        commitSelection(new Set([id]));
        lastSelectedId = id;
        return;
      }

      const next = new Set(selectedKeys);
      if (toggleOptions.shiftKey && lastSelectedId) {
        const start = rowIds.indexOf(lastSelectedId);
        const end = rowIds.indexOf(id);
        if (start !== -1 && end !== -1) {
          const [from, to] = start < end ? [start, end] : [end, start];
          for (const rowId of rowIds.slice(from, to + 1)) {
            if (!disabledIds.has(rowId)) next.add(rowId);
          }
          commitSelection(next);
          return;
        }
      }

      if (toggleOptions.metaKey || selectionBehavior === "toggle") {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      lastSelectedId = id;
      commitSelection(next);
    },
    toggleSelectAll() {
      if (selectionMode !== "multiple") return;
      const state = store.getSelectionState();
      if (state === "all") commitSelection(new Set());
      else commitSelection(new Set(rowIds.filter((id) => !disabledIds.has(id))));
    },
    toggleSort(column) {
      if (sortDescriptor?.column === column) {
        if (sortDescriptor.direction === "ascending") {
          store.setSortDescriptor({ column, direction: "descending" });
        } else {
          store.setSortDescriptor(null);
        }
        return;
      }
      store.setSortDescriptor({ column, direction: "ascending" });
    },
    updateOptions(nextOptions) {
      onSelectionChange = nextOptions.onSelectionChange;
      onSortChange = nextOptions.onSortChange;
      selectionBehavior = nextOptions.selectionBehavior ?? "toggle";
      selectionMode = nextOptions.selectionMode ?? "none";
    },
  };

  return store;
}

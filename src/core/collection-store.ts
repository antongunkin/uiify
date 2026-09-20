import { sortByDocumentOrder } from "./dom-order.js";

export interface CollectionItem<T> {
  readonly data: T;
  readonly element: HTMLElement | null;
  readonly id: string;
}

export interface CollectionStore<T> {
  getServerSnapshot(): readonly CollectionItem<T>[];
  getSnapshot(): readonly CollectionItem<T>[];
  register(item: CollectionItem<T>): () => void;
  setElement(id: string, element: HTMLElement | null): void;
  subscribe(listener: () => void): () => void;
  update(id: string, data: T): void;
}

const emptySnapshot: readonly CollectionItem<never>[] = Object.freeze([]);

export function createCollectionStore<T>(): CollectionStore<T> {
  const items = new Map<string, CollectionItem<T>>();
  const listeners = new Set<() => void>();
  let snapshot: readonly CollectionItem<T>[] = emptySnapshot;
  let dirty = false;

  const emit = () => {
    dirty = true;
    for (const listener of listeners) listener();
  };

  const read = () => {
    if (!dirty) return snapshot;
    snapshot = sortByDocumentOrder(items.values(), (item) => item.element);
    dirty = false;
    return snapshot;
  };

  return {
    getServerSnapshot: () => emptySnapshot as readonly CollectionItem<T>[],
    getSnapshot: read,
    register(item) {
      items.set(item.id, item);
      emit();
      return () => {
        if (items.delete(item.id)) emit();
      };
    },
    setElement(id, element) {
      const item = items.get(id);
      if (!item || item.element === element) return;
      items.set(id, { ...item, element });
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(id, data) {
      const item = items.get(id);
      if (!item || Object.is(item.data, data)) return;
      items.set(id, { ...item, data });
      emit();
    },
  };
}

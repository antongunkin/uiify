"use client";

import { createContext, useCallback, useContext, useRef, useSyncExternalStore } from "react";
import type { PropsWithChildren, RefCallback } from "react";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import {
  createCollectionStore,
  type CollectionItem,
  type CollectionStore,
} from "./collection-store.js";

const CollectionContext = createContext<CollectionStore<unknown> | null>(null);

export function CollectionProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<CollectionStore<unknown> | null>(null);
  storeRef.current ??= createCollectionStore();
  return <CollectionContext value={storeRef.current}>{children}</CollectionContext>;
}
CollectionProvider.displayName = "CollectionProvider";

export function useCollectionStore<T>(): CollectionStore<T> {
  const store = useContext(CollectionContext);
  if (!store) throw new Error("useCollectionStore must be used inside CollectionProvider");
  return store as CollectionStore<T>;
}

export function useCollection<T>(): readonly CollectionItem<T>[] {
  const store = useCollectionStore<T>();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

export interface UseCollectionItemOptions<T> {
  readonly data: T;
  readonly id: string;
}

export function useCollectionItem<T>({
  data,
  id,
}: UseCollectionItemOptions<T>): RefCallback<HTMLElement> {
  const store = useCollectionStore<T>();
  useIsomorphicLayoutEffect(() => store.register({ data, element: null, id }), [id, store]);
  useIsomorphicLayoutEffect(() => {
    store.update(id, data);
  }, [data, id, store]);

  return useCallback((element: HTMLElement | null) => store.setElement(id, element), [id, store]);
}

export { createCollectionStore };
export type { CollectionItem, CollectionStore };

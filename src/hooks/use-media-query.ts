"use client";

import { useCallback, useSyncExternalStore } from "react";

interface MediaQueryStore {
  mediaQueryList: MediaQueryList;
  listeners: Set<() => void>;
  notify: () => void;
}

const mediaQueryStores = new Map<string, MediaQueryStore>();

function getMediaQueryStore(query: string): MediaQueryStore | undefined {
  if (typeof window === "undefined") return undefined;

  let store = mediaQueryStores.get(query);
  if (!store) {
    const listeners = new Set<() => void>();
    store = {
      mediaQueryList: window.matchMedia(query),
      listeners,
      notify: () => {
        for (const listener of listeners) listener();
      },
    };
    mediaQueryStores.set(query, store);
  }
  return store;
}

function subscribe(query: string, onChange: () => void): () => void {
  const store = getMediaQueryStore(query);
  if (!store) return () => {};

  if (store.listeners.size === 0) {
    store.mediaQueryList.addEventListener("change", store.notify);
  }
  store.listeners.add(onChange);

  return () => {
    store.listeners.delete(onChange);
    if (store.listeners.size === 0) {
      store.mediaQueryList.removeEventListener("change", store.notify);
      mediaQueryStores.delete(query);
    }
  };
}

function getSnapshot(query: string): boolean {
  return getMediaQueryStore(query)?.mediaQueryList.matches ?? false;
}

const getServerSnapshot = (): boolean => false;

/** SSR-safe media-query match. Returns `false` during server render. */
export function useMediaQuery(query: string): boolean {
  const subscribeToQuery = useCallback(
    (onChange: () => void) => subscribe(query, onChange),
    [query],
  );
  const readQuery = useCallback(() => getSnapshot(query), [query]);

  return useSyncExternalStore(subscribeToQuery, readQuery, getServerSnapshot);
}

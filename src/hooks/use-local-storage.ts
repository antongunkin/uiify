"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";
import { resolveSetStateAction } from "./utils/set-state-action.js";

type StorageKeyListener = () => void;

const storageKeyListeners = new Map<string, Set<StorageKeyListener>>();
let storageEventSubscribed = false;

function dispatchStorageEvent(event: StorageEvent): void {
  if (event.key === null) {
    for (const listeners of storageKeyListeners.values()) {
      for (const listener of listeners) listener();
    }
    return;
  }

  const listeners = storageKeyListeners.get(event.key);
  if (!listeners) return;
  for (const listener of listeners) listener();
}

function subscribeStorageKey(key: string, listener: StorageKeyListener): () => void {
  let listeners = storageKeyListeners.get(key);
  if (!listeners) {
    listeners = new Set();
    storageKeyListeners.set(key, listeners);
  }
  listeners.add(listener);

  if (!storageEventSubscribed && typeof window !== "undefined") {
    window.addEventListener("storage", dispatchStorageEvent);
    storageEventSubscribed = true;
  }

  return () => {
    listeners!.delete(listener);
    if (listeners!.size === 0) {
      storageKeyListeners.delete(key);
    }
    if (storageKeyListeners.size === 0 && storageEventSubscribed && typeof window !== "undefined") {
      window.removeEventListener("storage", dispatchStorageEvent);
      storageEventSubscribed = false;
    }
  };
}

/**
 * SSR-safe persisted state backed by `localStorage`. Returns the default on the
 * server and on first client render, then hydrates the stored value after mount.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  const read = useCallback((): T => {
    if (typeof window === "undefined") return defaultValueRef.current;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? defaultValueRef.current : (JSON.parse(raw) as T);
    } catch {
      return defaultValueRef.current;
    }
  }, [key]);

  const [stored, setStored] = useState<T>(defaultValue);
  const storedRef = useRef(stored);
  storedRef.current = stored;

  const updateStored = useCallback((next: T) => {
    storedRef.current = next;
    setStored((current) => (Object.is(current, next) ? current : next));
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateStored(read());
  }, [read, updateStored]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const next = resolveSetStateAction(value, storedRef.current);
      storedRef.current = next;

      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
      } catch {
        // Ignore write errors caused by quota limits or private browsing.
      }

      updateStored(next);
    },
    [key, updateStored],
  );

  useEffect(() => {
    return subscribeStorageKey(key, () => {
      updateStored(read());
    });
  }, [key, read, updateStored]);

  return [stored, setValue];
}

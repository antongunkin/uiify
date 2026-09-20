"use client";

import { useCallback, useRef, useState } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { resolveSetStateAction, type SetStateAction } from "./utils/set-state-action.js";

export interface UseControllableStateParams<T> {
  /** Controlled value. When defined, the parent owns the state. */
  value?: T | undefined;
  /** Initial value for the uncontrolled case. */
  defaultValue?: T | undefined;
  /** Called with the next value on every change (controlled or not). */
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Unifies controlled and uncontrolled state. Returns `[value, setValue]`.
 * Controlled when `params.value !== undefined`; otherwise internal state
 * seeded from `defaultValue`. `setValue` accepts a value or updater.
 */
export function useControllableState<T>(
  params: UseControllableStateParams<T>,
): [T, (next: SetStateAction<T>) => void] {
  const { value: controlled, defaultValue, onChange } = params;
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue as T);
  const isControlled = controlled !== undefined;
  const value = (isControlled ? controlled : uncontrolled) as T;

  const valueRef = useRef(value);
  valueRef.current = value;
  const isControlledRef = useRef(isControlled);
  isControlledRef.current = isControlled;

  const emitChange = useEventCallback((next: T) => onChange?.(next));

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved = resolveSetStateAction(next, valueRef.current);
      if (Object.is(resolved, valueRef.current)) return;

      valueRef.current = resolved;
      if (!isControlledRef.current) {
        setUncontrolled(resolved);
      }
      emitChange(resolved);
    },
    [emitChange],
  );

  return [value, setValue];
}

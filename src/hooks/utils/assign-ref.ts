import type { Ref } from "react";

export type RefCleanup = () => void;

/** Assign a value to an object or callback ref; returns callback-ref cleanup when present. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): RefCleanup | void {
  if (typeof ref === "function") {
    const cleanup = ref(value);
    return typeof cleanup === "function" ? cleanup : undefined;
  }
  if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

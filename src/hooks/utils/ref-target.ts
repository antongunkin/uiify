import type { RefObject } from "react";

export function isRefObject<T extends EventTarget>(
  target: RefObject<T | null> | T | null | undefined,
): target is RefObject<T | null> {
  return (
    target !== null &&
    typeof target === "object" &&
    "current" in target &&
    !(target instanceof EventTarget)
  );
}

export function resolveTarget<T extends EventTarget>(
  target: RefObject<T | null> | T | null | undefined,
): EventTarget | null {
  if (target === undefined) {
    return typeof window !== "undefined" ? window : null;
  }
  if (target === null) return null;
  if (isRefObject(target)) {
    return target.current;
  }
  return target;
}

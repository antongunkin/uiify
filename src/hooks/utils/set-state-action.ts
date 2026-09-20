export type SetStateAction<T> = T | ((previous: T) => T);

/** Resolve a value or functional updater against the current snapshot. */
export function resolveSetStateAction<T>(action: SetStateAction<T>, current: T): T {
  return typeof action === "function" ? (action as (previous: T) => T)(current) : action;
}

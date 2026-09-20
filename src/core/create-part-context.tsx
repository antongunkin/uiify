"use client";

import { createContext, useContext } from "react";
import type { Provider } from "react";

/**
 * One React context per compound component, with the "part rendered outside its
 * root" error spelled the same way everywhere.
 *
 * Returns a tuple, not an object, so the consumer binds the reader to a name
 * starting with `use` — a method call like `ctx.use()` is invisible to the
 * react-hooks lint rules.
 *
 * @param componentName Public compound name, e.g. `"DropdownMenu"`.
 * @param rootName Part that provides the context. `"Root"` for nearly every
 *   compound; `"Provider"` for Tooltip.
 */
export function createPartContext<TValue>(
  componentName: string,
  rootName = "Root",
): readonly [Provider<TValue | null>, (part: string) => TValue] {
  const Context = createContext<TValue | null>(null);

  function usePartContext(part: string): TValue {
    const value = useContext(Context);
    if (value === null) {
      throw new Error(`${componentName}.${part} must be used within ${componentName}.${rootName}`);
    }
    return value;
  }

  return [Context.Provider, usePartContext] as const;
}

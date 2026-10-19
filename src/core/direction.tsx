"use client";

import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

export type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction | undefined>(undefined);

export interface DirectionProviderProps extends PropsWithChildren {
  readonly dir: Direction;
}

export function DirectionProvider({ children, dir }: DirectionProviderProps) {
  return <DirectionContext value={dir}>{children}</DirectionContext>;
}
DirectionProvider.displayName = "DirectionProvider";

export function useDirection(local?: Direction, element?: Element | null): Direction {
  const inherited = useContext(DirectionContext);
  if (local) return local;

  const semanticDirection = element?.closest("[dir]")?.getAttribute("dir");
  return semanticDirection === "rtl" || semanticDirection === "ltr"
    ? semanticDirection
    : (inherited ?? "ltr");
}

/** Returns `local`, else the nearest `DirectionProvider` value, else `undefined`. */
export function useDirectionOverride(local?: Direction): Direction | undefined {
  const inherited = useContext(DirectionContext);
  return local ?? inherited;
}

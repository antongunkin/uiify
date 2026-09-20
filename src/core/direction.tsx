"use client";

import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

export type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction>("ltr");

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
  return semanticDirection === "rtl" || semanticDirection === "ltr" ? semanticDirection : inherited;
}

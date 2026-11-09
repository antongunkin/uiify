import type { ComponentPropsWithRef } from "react";

export type HeaderPlacement = "static" | "sticky";

export interface HeaderProps extends ComponentPropsWithRef<"header"> {
  readonly placement?: HeaderPlacement;
}

export type HeaderClientState = "top" | "visible" | "hidden";

export interface HeaderClientProps extends HeaderProps {
  readonly hideOnScroll?: boolean;
  readonly scrollTarget?: string;
}

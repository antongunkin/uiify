import type { ComponentPropsWithRef } from "react";

export type HeaderPlacement = "static" | "sticky";

export interface HeaderRootProps extends ComponentPropsWithRef<"header"> {
  readonly placement?: HeaderPlacement;
}

export type HeaderClientState = "top" | "visible" | "hidden";

export interface HeaderClientProps extends HeaderRootProps {
  readonly hideOnScroll?: boolean;
  readonly scrollTarget?: string;
}

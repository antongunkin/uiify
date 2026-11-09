import type { ComponentPropsWithRef } from "react";

export type HeaderPlacement = "static" | "sticky";

/** `default` is the unset look; `primary` fills the bar with the brand colour. */
export type HeaderTone = "default" | "primary";

export interface HeaderProps extends ComponentPropsWithRef<"header"> {
  readonly placement?: HeaderPlacement;
  /**
   * `primary` fills the header with `--primary` and sets its text to `--primary-foreground`;
   * `Text` without `tone` inherits it. Written as data-tone; `default` renders none.
   */
  readonly tone?: HeaderTone;
}

export type HeaderClientState = "top" | "visible" | "hidden";

export interface HeaderClientProps extends HeaderProps {
  readonly hideOnScroll?: boolean;
  readonly scrollTarget?: string;
}

// API informed by shadcn/ui public documentation (names and props only).
import type { ComponentPropsWithRef } from "react";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorOwnProps {
  /** Direction of the line. Vertical also writes aria-orientation="vertical". @default "horizontal" */
  readonly orientation?: SeparatorOrientation;
}

/**
 * A native hr: a thematic break exposed as a separator. For a purely decorative line pass
 * role="none" (and aria-orientation={undefined} when vertical).
 */
export type SeparatorProps = SeparatorOwnProps &
  Omit<ComponentPropsWithRef<"hr">, keyof SeparatorOwnProps>;

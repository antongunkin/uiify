import type { ReactNode } from "react";

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly closeLabel?: ReactNode;
  readonly side?: DrawerSide;
  readonly triggerClassName?: string;
  readonly className?: string;
  readonly closeClassName?: string;
}

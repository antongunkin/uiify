import type { ReactNode } from "react";

export interface ToggleProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

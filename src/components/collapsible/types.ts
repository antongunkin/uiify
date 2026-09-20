import type { ReactNode } from "react";

export interface CollapsibleProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly content: ReactNode;
  readonly defaultOpen?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

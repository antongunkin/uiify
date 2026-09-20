import type { ReactNode } from "react";

export interface RadioGroupItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
}

export interface RadioGroupProps {
  readonly id: string;
  readonly items: readonly RadioGroupItem[];
  readonly defaultValue?: string;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly orientation?: "horizontal" | "vertical";
  readonly className?: string;
  readonly "aria-label"?: string;
}

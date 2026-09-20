import type { ReactNode } from "react";

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps {
  readonly id: string;
  readonly label?: ReactNode;
  readonly checked?: CheckedState;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly "aria-label"?: string;
}

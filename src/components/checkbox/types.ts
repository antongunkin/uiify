import type { ReactNode } from "react";
import type { NativeCheckControlSlotProps } from "../internal/native-check-control/types.js";

export type CheckedState = boolean | "indeterminate";

export type CheckboxSlotProps = NativeCheckControlSlotProps;

export interface CheckboxProps {
  readonly id: string;
  readonly label?: ReactNode;
  readonly checked?: CheckedState;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly slotProps?: CheckboxSlotProps;
  readonly "aria-label"?: string;
}

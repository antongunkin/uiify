import type { ReactNode } from "react";
import type { SlotProps } from "../../../core/slot-props.js";

export type CheckedState = boolean | "indeterminate";

export interface NativeCheckControlSlotProps {
  readonly input?: SlotProps<"input">;
  readonly label?: SlotProps<"label">;
}

export interface NativeCheckControlProps {
  readonly id: string;
  readonly label?: ReactNode;
  readonly checked?: CheckedState;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly slotProps?: NativeCheckControlSlotProps;
  readonly "aria-label"?: string;
}

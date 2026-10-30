import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";

export type ToggleControlSlotProps = SlotProps<"input">;

export type ToggleLabelSlotProps = SlotProps<"label">;

export interface ToggleSlotProps {
  readonly control?: ToggleControlSlotProps;
  readonly label?: ToggleLabelSlotProps;
}

export interface ToggleOwnProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly onPressedChange?: (pressed: boolean) => void;
  readonly disabled?: boolean;
  readonly slotProps?: ToggleSlotProps;
}

export type ToggleProps = ToggleOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    keyof ToggleOwnProps | "children" | "dangerouslySetInnerHTML" | "id"
  >;

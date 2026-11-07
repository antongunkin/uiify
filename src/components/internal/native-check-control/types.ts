import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SlotProps } from "../../../core/slot-props.js";

export type NativeCheckControlCheckedState = boolean | "indeterminate";

export interface NativeCheckControlSlotProps {
  readonly input?: SlotProps<"input">;
  readonly label?: SlotProps<"label">;
}

export interface NativeCheckControlOwnProps {
  readonly id: string;
  readonly label?: ReactNode;
  /** Boolean native state only; the mixed state is owned by the client wrapper. */
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly slotProps?: NativeCheckControlSlotProps;
  readonly "aria-label"?: string;
}

/** Own props plus every native input attribute; native values replace library defaults. */
export type NativeCheckControlProps = NativeCheckControlOwnProps &
  Omit<
    ComponentPropsWithRef<"input">,
    keyof NativeCheckControlOwnProps | "type" | "children" | "className" | "dangerouslySetInnerHTML"
  >;

export type NativeCheckControlClientProps = Omit<NativeCheckControlProps, "checked"> & {
  /** Adds the DOM `indeterminate` property and mixed ARIA/data state after hydration. */
  readonly checked?: NativeCheckControlCheckedState;
};

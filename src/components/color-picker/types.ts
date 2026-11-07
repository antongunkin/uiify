import type { ChangeEventHandler, ComponentPropsWithRef, CSSProperties, Ref } from "react";
import type { ConsumerDataAttributes, SlotProps } from "../../core/slot-props.js";

export type ColorSpace = "limited-srgb" | "display-p3";

export type ColorPickerFieldSlotProps = SlotProps<"div">;
export type ColorPickerLabelSlotProps = SlotProps<"label">;
export type ColorPickerSurfaceSlotProps = SlotProps<"div">;
export type ColorPickerControlSlotProps = SlotProps<"input">;
export type ColorPickerInputSlotProps = SlotProps<"input"> & {
  readonly alpha?: string | undefined;
  readonly colorspace?: ColorSpace | undefined;
};

export interface ColorPickerSlotProps {
  readonly field?: ColorPickerFieldSlotProps;
  readonly label?: ColorPickerLabelSlotProps;
  readonly surface?: ColorPickerSurfaceSlotProps;
  readonly control?: ColorPickerControlSlotProps;
  readonly input?: ColorPickerInputSlotProps;
}

export interface ColorPickerOwnProps {
  readonly alpha?: boolean;
  readonly colorSpace?: ColorSpace;
  readonly defaultValue?: string;
  readonly label: string;
  readonly onValueChange?: (value: string) => void;
  readonly slotProps?: ColorPickerSlotProps;
  readonly value?: string;
}

export type ColorPickerProps = Omit<
  ComponentPropsWithRef<"input">,
  "alpha" | "className" | "colorSpace" | "defaultValue" | "onChange" | "ref" | "style" | "value"
> &
  ColorPickerOwnProps & {
    readonly className?: string;
    readonly onChange?: ChangeEventHandler<HTMLInputElement>;
    readonly ref?: Ref<HTMLInputElement>;
    readonly style?: CSSProperties;
  } & ConsumerDataAttributes;

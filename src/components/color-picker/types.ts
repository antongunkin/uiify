import type { ChangeEventHandler, ComponentPropsWithRef, CSSProperties, Ref } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

export type ColorSpace = "limited-srgb" | "display-p3";

type ColorPickerPartOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-color-picker"?: never;
};

type ColorPickerLabelOwnedAttributes = ColorPickerPartOwnedAttributes & {
  readonly "data-disabled"?: never;
  readonly "data-required"?: never;
};

type ColorPickerSurfaceOwnedAttributes = ColorPickerPartOwnedAttributes & {
  readonly "data-value"?: never;
};

type ColorPickerControlOwnedAttributes = ColorPickerLabelOwnedAttributes & {
  readonly "data-invalid"?: never;
  readonly "data-uiify-input"?: never;
};

type ColorPickerFieldOwnedAttributes = ColorPickerLabelOwnedAttributes & {
  readonly "data-invalid"?: never;
  readonly "data-uiify-field"?: never;
};

export type ColorPickerFieldSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  | "children"
  | "dangerouslySetInnerHTML"
  | "data-disabled"
  | "data-invalid"
  | "data-part"
  | "data-required"
  | "data-uiify-color-picker"
  | "data-uiify-field"
  | "id"
> &
  ConsumerDataAttributes &
  ColorPickerFieldOwnedAttributes;

export type ColorPickerLabelSlotProps = Omit<
  ComponentPropsWithRef<"label">,
  | "children"
  | "dangerouslySetInnerHTML"
  | "id"
  | "htmlFor"
  | "data-disabled"
  | "data-part"
  | "data-required"
  | "data-uiify-color-picker"
> &
  ConsumerDataAttributes &
  ColorPickerLabelOwnedAttributes;

export type ColorPickerSurfaceSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-color-picker" | "data-value"
> &
  ConsumerDataAttributes &
  ColorPickerSurfaceOwnedAttributes;

export type ColorPickerControlSlotProps = Omit<
  ComponentPropsWithRef<"input">,
  | "children"
  | "dangerouslySetInnerHTML"
  | "aria-describedby"
  | "aria-hidden"
  | "aria-invalid"
  | "aria-labelledby"
  | "aria-required"
  | "disabled"
  | "defaultValue"
  | "id"
  | "name"
  | "readOnly"
  | "required"
  | "tabIndex"
  | "type"
  | "value"
  | "data-disabled"
  | "data-invalid"
  | "data-part"
  | "data-required"
  | "data-uiify-color-picker"
  | "data-uiify-input"
> &
  ConsumerDataAttributes &
  ColorPickerControlOwnedAttributes;

export type ColorPickerInputSlotProps = Omit<
  ComponentPropsWithRef<"input">,
  | "children"
  | "dangerouslySetInnerHTML"
  | "aria-invalid"
  | "aria-label"
  | "aria-labelledby"
  | "disabled"
  | "id"
  | "type"
  | "value"
  | "alpha"
  | "colorspace"
  | "defaultValue"
  | "data-part"
  | "data-uiify-color-picker"
  | "required"
> &
  ConsumerDataAttributes &
  ColorPickerPartOwnedAttributes;

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
  | "alpha"
  | "className"
  | "colorSpace"
  | "defaultValue"
  | "onChange"
  | "ref"
  | "style"
  | "type"
  | "value"
> &
  ColorPickerOwnProps & {
    readonly className?: string;
    readonly onChange?: ChangeEventHandler<HTMLInputElement>;
    readonly ref?: Ref<HTMLInputElement>;
    readonly style?: CSSProperties;
  } & {
    readonly "data-uiify-color-picker"?: never;
    readonly "data-uiify-field"?: never;
  };

import type { ChangeEventHandler, ComponentPropsWithRef, CSSProperties, Ref } from "react";

export type ColorSpace = "limited-srgb" | "display-p3";

export interface ColorPickerOwnProps {
  readonly alpha?: boolean;
  readonly colorSpace?: ColorSpace;
  readonly defaultValue?: string;
  readonly label: string;
  readonly onValueChange?: (value: string) => void;
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
  };

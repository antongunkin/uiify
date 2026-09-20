import type { ReactNode } from "react";

export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface HslColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;
  readonly a: number;
}

export interface HsbColor {
  readonly h: number;
  readonly s: number;
  readonly b: number;
  readonly a: number;
}

export type ColorFormat = "hex" | "rgb" | "hsl" | "hsb";

export interface Color {
  readonly rgb: RgbColor;
}

export interface ColorPickerContextValue {
  readonly alpha: boolean;
  readonly color: Color;
  readonly format: ColorFormat;
  readonly popoverId: string;
  readonly setColor: (color: Color) => void;
}

export interface ColorPickerRootShellOwnProps {
  readonly alpha?: boolean;
  readonly defaultValue?: Color;
  readonly format?: ColorFormat;
}

export interface ColorPickerRootControlledOwnProps {
  readonly onChange?: (color: Color) => void;
  readonly value?: Color;
}

export interface ColorPickerRootShellProps extends ColorPickerRootShellOwnProps {
  readonly children?: ReactNode;
}

export interface ColorPickerRootProps
  extends ColorPickerRootShellOwnProps, ColorPickerRootControlledOwnProps {
  readonly children?: ReactNode;
}

export interface ColorPickerTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ColorPickerContentOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ColorPickerAreaOwnProps {
  readonly className?: string;
}

export interface ColorPickerSliderOwnProps {
  readonly channel: "hue" | "alpha";
  readonly className?: string;
}

export interface ColorPickerSwatchOwnProps {
  readonly className?: string;
  readonly value: string;
}

export interface ColorPickerSwatchGroupOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly swatches?: readonly string[];
}

export interface ColorPickerFieldOwnProps {
  readonly className?: string;
}

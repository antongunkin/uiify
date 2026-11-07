import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";

interface NativeSelectShellOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly name?: string;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
}

export interface NativeSelectSingleOwnProps extends NativeSelectShellOwnProps {
  readonly defaultValue?: string;
  readonly multiple?: false;
  /** Called with the selected value. */
  readonly onValueChange?: (value: string) => void;
  readonly value?: string;
}

export interface NativeSelectMultiOwnProps extends NativeSelectShellOwnProps {
  /** Selects several options through the native `multiple` select. */
  readonly defaultValue?: readonly string[];
  readonly multiple: true;
  /** Called with every selected value in option order. */
  readonly onValueChange?: (value: string[]) => void;
  readonly value?: readonly string[];
}

export type NativeSelectOwnProps = NativeSelectSingleOwnProps | NativeSelectMultiOwnProps;

export type NativeSelectProps<TAs extends ElementType = "select"> = RenderableProps<
  TAs,
  NativeSelectOwnProps,
  NativeSelectOwnProps,
  HTMLSelectElement
>;

export interface NativeSelectContentOwnProps {
  readonly children?: ReactNode;
}

export interface NativeSelectOptionOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly value: string;
}

export type NativeSelectOptionProps<TAs extends ElementType = "option"> = RenderableProps<
  TAs,
  NativeSelectOptionOwnProps,
  { disabled: boolean },
  HTMLOptionElement
>;

export interface NativeSelectOptGroupOwnProps {
  readonly children?: ReactNode;
  readonly label: string;
}

export type NativeSelectOptGroupProps<TAs extends ElementType = "optgroup"> = RenderableProps<
  TAs,
  NativeSelectOptGroupOwnProps,
  NativeSelectOptGroupOwnProps,
  HTMLOptGroupElement
>;

export interface NativeSelectSeparatorOwnProps {
  readonly children?: never;
}

export type NativeSelectSeparatorProps<TAs extends ElementType = "hr"> = RenderableProps<
  TAs,
  NativeSelectSeparatorOwnProps,
  Record<string, never>,
  HTMLHRElement
>;

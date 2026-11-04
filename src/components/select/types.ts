import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";

interface SelectRootShellOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly name?: string;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
}

export interface SelectRootSingleOwnProps extends SelectRootShellOwnProps {
  readonly defaultValue?: string;
  readonly multiple?: false;
  /** Called with the selected value. */
  readonly onValueChange?: (value: string) => void;
  readonly value?: string;
}

export interface SelectRootMultiOwnProps extends SelectRootShellOwnProps {
  /** Selects several options through the native `multiple` select. */
  readonly defaultValue?: readonly string[];
  readonly multiple: true;
  /** Called with every selected value in option order. */
  readonly onValueChange?: (value: string[]) => void;
  readonly value?: readonly string[];
}

export type SelectRootOwnProps = SelectRootSingleOwnProps | SelectRootMultiOwnProps;

export type SelectRootProps<TAs extends ElementType = "select"> = RenderableProps<
  TAs,
  SelectRootOwnProps,
  SelectRootOwnProps,
  HTMLSelectElement
>;

export interface SelectContentOwnProps {
  readonly children?: ReactNode;
}

export interface SelectItemOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly value: string;
}

export type SelectItemProps<TAs extends ElementType = "option"> = RenderableProps<
  TAs,
  SelectItemOwnProps,
  { disabled: boolean },
  HTMLOptionElement
>;

export interface SelectGroupOwnProps {
  readonly children?: ReactNode;
  readonly label: string;
}

export type SelectGroupProps<TAs extends ElementType = "optgroup"> = RenderableProps<
  TAs,
  SelectGroupOwnProps,
  SelectGroupOwnProps,
  HTMLOptGroupElement
>;

export interface SelectSeparatorOwnProps {
  readonly children?: never;
}

export type SelectSeparatorProps<TAs extends ElementType = "hr"> = RenderableProps<
  TAs,
  SelectSeparatorOwnProps,
  Record<string, never>,
  HTMLHRElement
>;

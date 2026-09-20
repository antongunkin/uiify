import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SelectRootOwnProps {
  readonly children?: ReactNode;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly name?: string;
  readonly disabled?: boolean;
}

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

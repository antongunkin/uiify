import type { ElementType, ReactNode, RefObject } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface NumberFieldContextValue {
  readonly clampValueOnBlur: boolean;
  readonly commitInput: (raw: string) => void;
  readonly decrement: (multiplier?: number) => void;
  readonly disabled: boolean;
  readonly displayValue: string;
  readonly formatter: Intl.NumberFormat;
  readonly increment: (multiplier?: number) => void;
  readonly inputId: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly max?: number | undefined;
  readonly min?: number | undefined;
  readonly numericValue: number | undefined;
  readonly readOnly: boolean;
  readonly required: boolean;
  readonly setDisplayValue: (next: string) => void;
  readonly setEditing: (next: boolean) => void;
}

export interface NumberFieldRootOwnProps {
  readonly allowWheel?: boolean;
  readonly clampValueOnBlur?: boolean;
  readonly defaultValue?: number;
  readonly disabled?: boolean;
  readonly formatOptions?: Intl.NumberFormatOptions;
  readonly max?: number;
  readonly min?: number;
  readonly onChange?: (value: number | undefined) => void;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly step?: number;
  readonly value?: number;
}

export type NumberFieldRootProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  NumberFieldRootOwnProps,
  NumberFieldRootOwnProps,
  HTMLElement
>;

export type NumberFieldGroupProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  { disabled: boolean },
  HTMLElement
>;

export type NumberFieldInputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  Record<string, never>,
  { disabled: boolean; readOnly: boolean; required: boolean },
  HTMLInputElement
>;

export type NumberFieldIncrementProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  { disabled: boolean },
  HTMLButtonElement
>;

export type NumberFieldDecrementProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  { disabled: boolean },
  HTMLButtonElement
>;

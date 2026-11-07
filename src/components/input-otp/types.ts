import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";

export type InputOTPType = "numeric" | "alphanumeric";

export interface InputOTPContextValue {
  readonly activeIndex: number;
  readonly autoFocus: boolean;
  readonly disabled: boolean;
  readonly hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  readonly length: number;
  readonly mask: boolean;
  readonly type: InputOTPType;
  readonly updateValue: (raw: string) => void;
  readonly value: string;
  readonly onHiddenBlur: () => void;
  readonly onHiddenFocus: () => void;
}

export interface InputOTPShellOwnProps {
  readonly autoFocus?: boolean;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly length?: number;
  readonly mask?: boolean;
  readonly pattern?: string;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
  readonly type?: InputOTPType;
}

export interface InputOTPControlledOwnProps {
  readonly onValueChange?: (value: string) => void;
  readonly onComplete?: (value: string) => void;
  readonly value?: string;
}

export type InputOTPShellProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  InputOTPShellOwnProps,
  InputOTPShellOwnProps,
  HTMLElement
>;

export type InputOTPProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  InputOTPShellOwnProps & InputOTPControlledOwnProps,
  InputOTPShellOwnProps & InputOTPControlledOwnProps,
  HTMLElement
>;

export interface InputOTPSlotOwnProps {
  readonly index: number;
}

export type InputOTPSlotProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  InputOTPSlotOwnProps,
  { active: boolean; filled: boolean },
  HTMLElement
>;

export type InputOTPHiddenInputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  { readonly autoFocus?: boolean | undefined },
  { disabled: boolean },
  HTMLInputElement
>;

import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type OtpInputType = "numeric" | "alphanumeric";

export interface OtpInputContextValue {
  readonly activeIndex: number;
  readonly autoFocus: boolean;
  readonly disabled: boolean;
  readonly hiddenInputRef: React.RefObject<HTMLInputElement | null>;
  readonly length: number;
  readonly mask: boolean;
  readonly type: OtpInputType;
  readonly updateValue: (raw: string) => void;
  readonly value: string;
  readonly onHiddenBlur: () => void;
  readonly onHiddenFocus: () => void;
}

export interface OtpInputRootShellOwnProps {
  readonly autoFocus?: boolean;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly length?: number;
  readonly mask?: boolean;
  readonly pattern?: string;
  readonly type?: OtpInputType;
}

export interface OtpInputRootControlledOwnProps {
  readonly onChange?: (value: string) => void;
  readonly onComplete?: (value: string) => void;
  readonly value?: string;
}

export type OtpInputRootShellProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  OtpInputRootShellOwnProps,
  OtpInputRootShellOwnProps,
  HTMLElement
>;

export type OtpInputRootProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  OtpInputRootShellOwnProps & OtpInputRootControlledOwnProps,
  OtpInputRootShellOwnProps & OtpInputRootControlledOwnProps,
  HTMLElement
>;

export interface OtpInputSlotOwnProps {
  readonly index: number;
}

export type OtpInputSlotProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  OtpInputSlotOwnProps,
  { active: boolean; filled: boolean },
  HTMLElement
>;

export type OtpInputHiddenInputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  { readonly autoFocus?: boolean },
  { disabled: boolean },
  HTMLInputElement
>;

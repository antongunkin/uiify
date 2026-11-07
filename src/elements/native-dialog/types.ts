import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

export interface NativeDialogTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `NativeDialog.Content` this button opens; the browser resolves it at click time. */
  readonly target: string;
}

export type NativeDialogTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  NativeDialogTriggerOwnProps
>;

export interface NativeDialogCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `NativeDialog.Content` this button closes. */
  readonly target: string;
}

export type NativeDialogCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  NativeDialogCloseOwnProps
>;

export interface NativeDialogContentOwnProps {
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
}

/**
 * An unnamed `<dialog>` is an axe violation the browser has no fallback for, so the
 * accessible name is a type error to omit — exactly one of `aria-labelledby` or
 * `aria-label` is required.
 */
export type NativeDialogContentNameProps =
  | { readonly "aria-labelledby": string; readonly "aria-label"?: never }
  | { readonly "aria-label": string; readonly "aria-labelledby"?: never };

/**
 * A plain, initially closed `<dialog>`: `open` and `popover` are not part of the
 * native contract, and the accessible name is required (see `NativeDialogContentNameProps`).
 */
export type NativeDialogContentProps = NativeDialogContentOwnProps &
  NativeDialogContentNameProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof NativeDialogContentOwnProps | "open" | "popover" | "aria-label" | "aria-labelledby"
  >;

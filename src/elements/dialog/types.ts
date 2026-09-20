import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

export interface DialogTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `Dialog.Content` this button opens; the browser resolves it at click time. */
  readonly target: string;
}

export type DialogTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  DialogTriggerOwnProps
>;

export interface DialogCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `Dialog.Content` this button closes. */
  readonly target: string;
}

export type DialogCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  DialogCloseOwnProps
>;

export interface DialogContentOwnProps {
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
}

/**
 * An unnamed `<dialog>` is an axe violation the browser has no fallback for, so the
 * accessible name is a type error to omit — exactly one of `aria-labelledby` or
 * `aria-label` is required.
 */
export type DialogContentNameProps =
  | { readonly "aria-labelledby": string; readonly "aria-label"?: never }
  | { readonly "aria-label": string; readonly "aria-labelledby"?: never };

/**
 * A plain, initially closed `<dialog>`: `open` and `popover` are not part of the
 * native contract, and the accessible name is required (see `DialogContentNameProps`).
 */
export type DialogContentProps = DialogContentOwnProps &
  DialogContentNameProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof DialogContentOwnProps | "open" | "popover" | "aria-label" | "aria-labelledby"
  >;

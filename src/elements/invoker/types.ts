import type { ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

/**
 * The commands defined by the HTML Invoker Commands API, plus a consumer
 * `--*` custom command (template literal type). A custom command needs its
 * own JS listener on `commandfor`'s target — this element documents that
 * contract, it does not implement one.
 */
export type NativeCommand =
  | "show-modal"
  | "request-close"
  | "close"
  | "show-popover"
  | "hide-popover"
  | "toggle-popover"
  | `--${string}`;

export interface InvokerOwnProps {
  readonly children?: ReactNode;
  /** The command to invoke on `commandfor` when this button is activated. */
  readonly command: NativeCommand;
  /** `id` of the element this button invokes a command on. */
  readonly commandfor: string;
}

/**
 * `as` defaults to `"button"`; intrinsic tags other than `"button"` are a type
 * error — invoker commands only fire from a real button — and `type` is owned
 * by the element (it is always `"button"`, never `"submit"`/`"reset"`).
 */
export type InvokerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  InvokerOwnProps
>;

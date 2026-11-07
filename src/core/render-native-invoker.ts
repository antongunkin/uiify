import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import { cn } from "./class-names.js";

export type NativeInvokerCommand = "show-modal" | "request-close";

interface NativeInvokerOptions {
  readonly button?: boolean;
  readonly variant?: "secondary" | "ghost" | "destructive";
}

/**
 * Render a native invoker button. `command`/`commandfor` are lowercase HTML
 * attributes that React 19.2 passes through untouched; @types/react 19.2 does
 * not declare them and the lint rule react/no-unknown-property rejects them in
 * JSX, so they travel as a props object through createElement. Shared by the
 * Dialog and AlertDialog parts, which use identical `show-modal`/`request-close`
 * command semantics; Popover parts use `popoverTarget`/`popoverTargetAction`
 * instead and keep their own renderer (see popup/PopoverParts.tsx).
 *
 * The invoker attributes, `type="button"` and markers are defaults: consumer props replace them.
 * `identity` is the part's `uiify-*` class (joined with the consumer's `className`), or — for
 * components not yet migrated to identity classes — their legacy marker attributes.
 */
export function renderNativeInvoker(
  as: ElementType | undefined,
  identity: string | Readonly<Record<string, string>>,
  command: NativeInvokerCommand,
  target: string,
  consumerProps: Record<string, unknown>,
  options: NativeInvokerOptions = {},
): ReactElement {
  return createElement(as ?? "button", {
    type: "button",
    command,
    commandfor: target,
    ...(typeof identity === "string" ? {} : identity),
    ...(options.variant ? { "data-variant": options.variant } : {}),
    ...consumerProps,
    className: cn(
      typeof identity === "string" ? identity : undefined,
      options.button ? "uiify-button" : undefined,
      consumerProps.className as string | undefined,
    ),
  });
}

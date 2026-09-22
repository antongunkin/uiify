import { createElement } from "react";
import type { ElementType, ReactElement } from "react";

export type NativeInvokerCommand = "show-modal" | "request-close";

interface NativeInvokerOptions {
  readonly button?: boolean;
  readonly variant?: "ghost" | "danger";
}

/**
 * Render a native invoker button. `command`/`commandfor` are lowercase HTML
 * attributes that React 19.2 passes through untouched; @types/react 19.2 does
 * not declare them and the lint rule react/no-unknown-property rejects them in
 * JSX, so they travel as a props object through createElement. Shared by the
 * Modal and AlertModal parts, which use identical `show-modal`/`request-close`
 * command semantics; Popup uses `popoverTarget`/`popoverTargetAction` instead
 * and keeps its own renderer (see popup/PopupParts.tsx).
 *
 */
export function renderNativeInvoker(
  as: ElementType | undefined,
  marker: string,
  part: string,
  command: NativeInvokerCommand,
  target: string,
  consumerProps: Record<string, unknown>,
  options: NativeInvokerOptions = {},
): ReactElement {
  return createElement(as ?? "button", {
    ...consumerProps,
    ...(options.button ? { "data-uiify-button": "" } : {}),
    [marker]: "",
    "data-part": part,
    ...(options.variant ? { "data-variant": options.variant } : {}),
    command,
    commandfor: target,
    type: "button",
  });
}

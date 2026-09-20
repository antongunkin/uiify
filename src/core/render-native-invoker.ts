import { createElement } from "react";
import type { ElementType, ReactElement } from "react";

export type NativeInvokerCommand = "show-modal" | "request-close";

/**
 * Render a native invoker button. `command`/`commandfor` are lowercase HTML
 * attributes that React 19.2 passes through untouched; @types/react 19.2 does
 * not declare them and the lint rule react/no-unknown-property rejects them in
 * JSX, so they travel as a props object through createElement. Shared by the
 * Modal and AlertModal parts, which use identical `show-modal`/`request-close`
 * command semantics; Popup uses `popoverTarget`/`popoverTargetAction` instead
 * and keeps its own renderer (see popup/PopupParts.tsx).
 *
 * `marker` accepts one or more attribute names so a component can emit its own
 * marker alongside a deprecated one during a rename transition; every name is set to `""`.
 */
export function renderNativeInvoker(
  as: ElementType | undefined,
  marker: string | readonly string[],
  command: NativeInvokerCommand,
  target: string,
  consumerProps: Record<string, unknown>,
): ReactElement {
  const markers = typeof marker === "string" ? [marker] : marker;
  return createElement(as ?? "button", {
    ...consumerProps,
    ...Object.fromEntries(markers.map((name) => [name, ""])),
    command,
    commandfor: target,
    type: "button",
  });
}

import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import type { InvokerProps } from "./types.js";

/**
 * Render a native invoker button. `command`/`commandfor` are lowercase HTML
 * attributes that React 19.2 passes through untouched; @types/react 19.2 does
 * not declare them and the lint rule react/no-unknown-property rejects them
 * in JSX, so they travel as a props object through `createElement` rather
 * than JSX. This is the one place that workaround is written — `Modal`,
 * `AlertModal` and every other `command`/`commandfor` consumer builds on this
 * element (or its `@gunkin/uiify/core/render` counterpart, `renderNativeInvoker`).
 */
export function Invoker<TAs extends ElementType = "button">(
  props: InvokerProps<TAs>,
): ReactElement {
  const { as, command, commandfor, ...consumerProps } = props as InvokerProps<"button">;
  return createElement(as ?? "button", {
    ...consumerProps,
    command,
    commandfor,
    "data-uiify-invoker": "",
    type: "button",
  });
}
Invoker.displayName = "Invoker";

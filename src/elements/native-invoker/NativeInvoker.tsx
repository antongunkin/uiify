import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import type { NativeInvokerProps } from "./types.js";

/**
 * Render a native invoker button. `command`/`commandfor` are lowercase HTML
 * attributes that React 19.2 passes through untouched; @types/react 19.2 does
 * not declare them and the lint rule react/no-unknown-property rejects them
 * in JSX, so they travel as a props object through `createElement` rather
 * than JSX. This is the one place that workaround is written — `NativeDialog`,
 * `AlertDialog` and every other `command`/`commandfor` consumer builds on this
 * element (or its `@gunkin/uiify/core/render` counterpart, `renderNativeInvoker`).
 */
export function NativeInvoker<TAs extends ElementType = "button">(
  props: NativeInvokerProps<TAs>,
): ReactElement {
  const { as, command, commandfor, ...consumerProps } = props as NativeInvokerProps<"button">;
  return createElement(as ?? "button", {
    type: "button",
    ...consumerProps,
    className: cn("uiify-native-invoker", consumerProps.className as string | undefined),
    command,
    commandfor,
  });
}
NativeInvoker.displayName = "NativeInvoker";

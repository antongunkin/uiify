import type { ElementType, ReactElement } from "react";
import { cn, renderNativeInvoker } from "@gunkin/uiify/core/render";
import type {
  NativeDialogCloseProps,
  NativeDialogContentProps,
  NativeDialogTriggerProps,
} from "./types.js";
/**
 * Opens `target` modally through the browser: no React handler, works before hydration.
 * Renders the `uiify-native-dialog-trigger` class.
 *
 * Defined via `Object.assign(fn, { displayName })` rather than this file's usual
 * `fn.displayName = "…"` statement: `NativeDialog.Trigger`/`.Content`/`.Close` are meant to be
 * consumed individually (`modal`, `alert-modal` and `drawer` each use a different subset), and
 * esbuild's default tree-shaking
 * cannot prove a bare `fn.displayName = "…"` assignment statement is side-effect-free, so it
 * keeps every part whose file is reachable at all. A pure-annotated expression assigned
 * directly to the export lets an unused part be dropped instead of taxing every consumer
 * for parts it never renders.
 */
function dialogTrigger<TAs extends ElementType = "button">(
  props: NativeDialogTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as NativeDialogTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-native-dialog-trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const NativeDialogTrigger = /* @__PURE__ */ Object.assign(dialogTrigger, {
  displayName: "NativeDialogTrigger",
});
/**
 * A plain, initially closed `<dialog>` with the `uiify-native-dialog-content` class.
 */
function dialogContent(props: NativeDialogContentProps): ReactElement {
  const { children, className, ...dialogProps } = props;
  return (
    <dialog {...dialogProps} className={cn("uiify-native-dialog-content", className)}>
      {children}
    </dialog>
  );
}
export const NativeDialogContent = /* @__PURE__ */ Object.assign(dialogContent, {
  displayName: "NativeDialogContent",
});
/**
 * Requests closing `target` (fires the cancelable `cancel` event first).
 * Renders the `uiify-native-dialog-close` class.
 */
function dialogClose<TAs extends ElementType = "button">(
  props: NativeDialogCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as NativeDialogCloseProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-native-dialog-close",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const NativeDialogClose = /* @__PURE__ */ Object.assign(dialogClose, {
  displayName: "NativeDialogClose",
});
export const NativeDialog = {
  Trigger: NativeDialogTrigger,
  Content: NativeDialogContent,
  Close: NativeDialogClose,
};

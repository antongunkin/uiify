import type { ElementType, ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type { DialogCloseProps, DialogContentProps, DialogTriggerProps } from "./types.js";

/**
 * Opens `target` modally through the browser: no React handler, works before hydration.
 * Emits `data-uiify-dialog` with `data-part="trigger"`.
 *
 * Defined via `Object.assign(fn, { displayName })` rather than this file's usual
 * `fn.displayName = "…"` statement: `Dialog.Trigger`/`.Content`/`.Close` are meant to be
 * consumed individually (`modal`, `alert-modal` and `drawer` each use a different subset), and
 * esbuild's default tree-shaking
 * cannot prove a bare `fn.displayName = "…"` assignment statement is side-effect-free, so it
 * keeps every part whose file is reachable at all. A pure-annotated expression assigned
 * directly to the export lets an unused part be dropped instead of taxing every consumer
 * for parts it never renders.
 */
function dialogTrigger<TAs extends ElementType = "button">(
  props: DialogTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as DialogTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-dialog",
    "trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const DialogTrigger = /* @__PURE__ */ Object.assign(dialogTrigger, {
  displayName: "DialogTrigger",
});

/**
 * A plain, initially closed `<dialog>`. Emits `data-uiify-dialog` with `data-part="content"`.
 */
function dialogContent(props: DialogContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog {...dialogProps} data-part="content" data-uiify-dialog="">
      {children}
    </dialog>
  );
}
export const DialogContent = /* @__PURE__ */ Object.assign(dialogContent, {
  displayName: "DialogContent",
});

/**
 * Requests closing `target` (fires the cancelable `cancel` event first).
 * Emits `data-uiify-dialog` with `data-part="close"`.
 */
function dialogClose<TAs extends ElementType = "button">(
  props: DialogCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as DialogCloseProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-dialog",
    "close",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const DialogClose = /* @__PURE__ */ Object.assign(dialogClose, {
  displayName: "DialogClose",
});

export const Dialog = {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Close: DialogClose,
};

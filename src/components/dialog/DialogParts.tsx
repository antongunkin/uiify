import { cn } from "../../core/class-names.js";
import type { ElementType, ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import { modalAppearanceAttributes } from "./attributes.js";
import type { DialogCloseProps, DialogContentProps, DialogTriggerProps } from "./types.js";

export {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogGrabber,
  DialogHeader,
  DialogTitle,
} from "./DialogAnatomy.js";

/** Native modal invoker with modal identity and trigger anatomy. */
export function DialogTrigger<TAs extends ElementType = "button">(
  props: DialogTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as DialogTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-dialog-trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
    { button: true },
  );
}
DialogTrigger.displayName = "DialogTrigger";

/** Native modal dialog content with modal identity and content anatomy. */
export function DialogContent(props: DialogContentProps): ReactElement {
  const { align, backdrop, children, dismiss, size, ...dialogProps } = props;
  return (
    <dialog
      {...modalAppearanceAttributes({ align, backdrop, dismiss, size })}
      {...dialogProps}
      className={cn("uiify-dialog uiify-dialog-content", dialogProps.className)}
    >
      {children}
    </dialog>
  );
}
DialogContent.displayName = "DialogContent";

/** Native modal close invoker. */
export function DialogClose<TAs extends ElementType = "button">(
  props: DialogCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as DialogCloseProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-dialog-close",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "ghost" },
  );
}
DialogClose.displayName = "DialogClose";

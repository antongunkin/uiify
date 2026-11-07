import type { ElementType, ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogTriggerProps,
} from "./types.js";
/** Native alert modal invoker with alert-modal identity and trigger anatomy. */
export function AlertDialogTrigger<TAs extends ElementType = "button">(
  props: AlertDialogTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertDialogTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-alert-dialog-trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
    { button: true },
  );
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";
/** Native alert dialog content with alert-modal identity and content anatomy. */
export function AlertDialogContent(props: AlertDialogContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog
      role="alertdialog"
      {...dialogProps}
      className={cn("uiify-alert-dialog-content", dialogProps.className)}
    >
      {children}
    </dialog>
  );
}
AlertDialogContent.displayName = "AlertDialogContent";
/** Native alert modal action invoker. */
export function AlertDialogAction<TAs extends ElementType = "button">(
  props: AlertDialogActionProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertDialogActionProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-alert-dialog-action",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "destructive" },
  );
}
AlertDialogAction.displayName = "AlertDialogAction";
/** Native alert modal cancel invoker. */
export function AlertDialogCancel<TAs extends ElementType = "button">(
  props: AlertDialogCancelProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertDialogCancelProps<"button">;
  return renderNativeInvoker(
    as,
    "uiify-alert-dialog-cancel",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "secondary" },
  );
}
AlertDialogCancel.displayName = "AlertDialogCancel";

import type { ElementType, ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type {
  AlertModalActionProps,
  AlertModalCancelProps,
  AlertModalContentProps,
  AlertModalTriggerProps,
} from "./types.js";

/** Native alert modal invoker with alert-modal identity and trigger anatomy. */
export function AlertModalTrigger<TAs extends ElementType = "button">(
  props: AlertModalTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
    { button: true },
  );
}
AlertModalTrigger.displayName = "AlertModalTrigger";

/** Native alert dialog content with alert-modal identity and content anatomy. */
export function AlertModalContent(props: AlertModalContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog {...dialogProps} data-part="content" data-uiify-alert-modal="" role="alertdialog">
      {children}
    </dialog>
  );
}
AlertModalContent.displayName = "AlertModalContent";

/** Native alert modal action invoker. */
export function AlertModalAction<TAs extends ElementType = "button">(
  props: AlertModalActionProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalActionProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "action",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "danger" },
  );
}
AlertModalAction.displayName = "AlertModalAction";

/** Native alert modal cancel invoker. */
export function AlertModalCancel<TAs extends ElementType = "button">(
  props: AlertModalCancelProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalCancelProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "cancel",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "ghost" },
  );
}
AlertModalCancel.displayName = "AlertModalCancel";

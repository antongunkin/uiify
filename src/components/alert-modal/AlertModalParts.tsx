import type { ElementType, ReactElement } from "react";
import { omitProps } from "../../core/slot-props.js";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type {
  AlertModalActionProps,
  AlertModalCancelProps,
  AlertModalContentProps,
  AlertModalTriggerProps,
} from "./types.js";

const ALERT_MODAL_TRIGGER_OWNED_PROPS = [
  "type",
  "command",
  "commandfor",
  "commandFor",
  "popoverTarget",
  "popoverTargetAction",
  "data-part",
  "data-uiify-button",
  "data-uiify-alert-modal",
  "dangerouslySetInnerHTML",
] as const;
const ALERT_MODAL_CHOICE_OWNED_PROPS = [
  ...ALERT_MODAL_TRIGGER_OWNED_PROPS,
  "data-variant",
] as const;

/** Native alert modal invoker with alert-modal identity and trigger anatomy. */
export function AlertModalTrigger<TAs extends ElementType = "button">(
  props: AlertModalTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as unknown as AlertModalTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "trigger",
    "show-modal",
    target,
    omitProps(consumerProps, ALERT_MODAL_TRIGGER_OWNED_PROPS) as Record<string, unknown>,
    { button: true },
  );
}
AlertModalTrigger.displayName = "AlertModalTrigger";

/** Native alert dialog content with alert-modal identity and content anatomy. */
export function AlertModalContent(props: AlertModalContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog
      {...omitProps(dialogProps, [
        "open",
        "popover",
        "role",
        "data-part",
        "data-uiify-alert-modal",
        "dangerouslySetInnerHTML",
      ])}
      data-part="content"
      data-uiify-alert-modal=""
      role="alertdialog"
    >
      {children}
    </dialog>
  );
}
AlertModalContent.displayName = "AlertModalContent";

/** Native alert modal action invoker. */
export function AlertModalAction<TAs extends ElementType = "button">(
  props: AlertModalActionProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as unknown as AlertModalActionProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "action",
    "request-close",
    target,
    omitProps(consumerProps, ALERT_MODAL_CHOICE_OWNED_PROPS) as Record<string, unknown>,
    { button: true, variant: "destructive" },
  );
}
AlertModalAction.displayName = "AlertModalAction";

/** Native alert modal cancel invoker. */
export function AlertModalCancel<TAs extends ElementType = "button">(
  props: AlertModalCancelProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as unknown as AlertModalCancelProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-alert-modal",
    "cancel",
    "request-close",
    target,
    omitProps(consumerProps, ALERT_MODAL_CHOICE_OWNED_PROPS) as Record<string, unknown>,
    { button: true, variant: "secondary" },
  );
}
AlertModalCancel.displayName = "AlertModalCancel";

import type { ElementType, ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type { ModalCloseProps, ModalContentProps, ModalTriggerProps } from "./types.js";

/** Native modal invoker with modal identity and trigger anatomy. */
export function ModalTrigger<TAs extends ElementType = "button">(
  props: ModalTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as ModalTriggerProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-modal",
    "trigger",
    "show-modal",
    target,
    consumerProps as Record<string, unknown>,
    { button: true },
  );
}
ModalTrigger.displayName = "ModalTrigger";

/** Native modal dialog content with modal identity and content anatomy. */
export function ModalContent(props: ModalContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog {...dialogProps} data-part="content" data-uiify-modal="">
      {children}
    </dialog>
  );
}
ModalContent.displayName = "ModalContent";

/** Native modal close invoker. */
export function ModalClose<TAs extends ElementType = "button">(
  props: ModalCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as ModalCloseProps<"button">;
  return renderNativeInvoker(
    as,
    "data-uiify-modal",
    "close",
    "request-close",
    target,
    consumerProps as Record<string, unknown>,
    { button: true, variant: "ghost" },
  );
}
ModalClose.displayName = "ModalClose";

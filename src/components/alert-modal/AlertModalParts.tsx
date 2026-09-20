import type { ElementType, ReactElement } from "react";
import {
  DialogClose as ElementDialogClose,
  DialogTrigger as ElementDialogTrigger,
} from "../../elements/dialog/index.js";
import type { DialogCloseProps, DialogTriggerProps } from "../../elements/dialog/index.js";
import type {
  AlertModalActionProps,
  AlertModalCancelProps,
  AlertModalContentProps,
  AlertModalTriggerProps,
} from "./types.js";

/**
 * Built on `@gunkin/uiify/elements/dialog`'s `Dialog.Trigger`, which already emits
 * `data-uiify-dialog-trigger` — additive, since this component's own markers are a
 * different string. Also emits `data-uiify-alert-modal-trigger` and the deprecated
 * `data-uiify-alert-dialog-trigger` during the compatibility window.
 *
 * Calls the element directly as a function rather than rendering `<ElementDialogTrigger>` —
 * see ModalParts.tsx's `ModalTrigger` for why (Tier 0, no hooks, skips a `jsx()` call).
 */
export function AlertModalTrigger<TAs extends ElementType = "button">(
  props: AlertModalTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalTriggerProps<"button">;
  return ElementDialogTrigger({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-alert-dialog-trigger": "",
    "data-uiify-alert-modal-trigger": "",
    target,
  } as unknown as DialogTriggerProps<TAs>);
}
AlertModalTrigger.displayName = "AlertModalTrigger";

/**
 * A modal `<dialog role="alertdialog">`; Escape and the parts close it, the backdrop does not.
 *
 * Mirrors `@gunkin/uiify/elements/dialog`'s `Dialog.Content` markup and marker
 * (`data-uiify-dialog-content`) plus `role="alertdialog"` and this component's own
 * `data-uiify-alert-modal-content` / deprecated `data-uiify-alert-dialog-content`. Written
 * inline rather than rendered through the element for the same reason as `ModalContent`:
 * `Dialog.Content`'s type requires an accessible name and `AlertModalContentProps`
 * deliberately does not tighten to match (see ModalParts.tsx).
 */
export function AlertModalContent(props: AlertModalContentProps): ReactElement {
  const { children, ...dialogProps } = props;
  return (
    <dialog
      {...dialogProps}
      data-uiify-alert-dialog-content=""
      data-uiify-alert-modal-content=""
      data-uiify-dialog-content=""
      role="alertdialog"
    >
      {children}
    </dialog>
  );
}
AlertModalContent.displayName = "AlertModalContent";

/**
 * Built on `@gunkin/uiify/elements/dialog`'s `Dialog.Close`. Also emits
 * `data-uiify-alert-modal-action` and the deprecated `data-uiify-alert-dialog-action`
 * for one major.
 */
export function AlertModalAction<TAs extends ElementType = "button">(
  props: AlertModalActionProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalActionProps<"button">;
  return ElementDialogClose({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-alert-dialog-action": "",
    "data-uiify-alert-modal-action": "",
    target,
  } as unknown as DialogCloseProps<TAs>);
}
AlertModalAction.displayName = "AlertModalAction";

/**
 * Built on `@gunkin/uiify/elements/dialog`'s `Dialog.Close`. Also emits
 * `data-uiify-alert-modal-cancel` and the deprecated `data-uiify-alert-dialog-cancel`
 * for one major.
 */
export function AlertModalCancel<TAs extends ElementType = "button">(
  props: AlertModalCancelProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as AlertModalCancelProps<"button">;
  return ElementDialogClose({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-alert-dialog-cancel": "",
    "data-uiify-alert-modal-cancel": "",
    target,
  } as unknown as DialogCloseProps<TAs>);
}
AlertModalCancel.displayName = "AlertModalCancel";

import type { ReactElement } from "react";
import {
  AlertModalAction,
  AlertModalCancel,
  AlertModalContent,
  AlertModalTrigger,
} from "./AlertModalParts.js";
import type { AlertModalProps } from "./types.js";

/** Convenience shell over the native parts: one trigger, one modal alertdialog, cancel and action. */
export function AlertModal({
  id,
  trigger,
  title,
  description,
  children,
  actionLabel = "Confirm",
  cancelLabel = "Cancel",
  triggerClassName,
  className,
  actionClassName,
  cancelClassName,
}: AlertModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div data-uiify-alert-dialog-scope="" data-uiify-alert-modal-scope="">
      <AlertModalTrigger className={triggerClassName} target={id}>
        {trigger}
      </AlertModalTrigger>
      <AlertModalContent
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        className={className}
        id={id}
      >
        <h2 id={titleId}>{title}</h2>
        {description === undefined ? null : <p id={descriptionId}>{description}</p>}
        {children}
        <AlertModalCancel className={cancelClassName} target={id} value="cancel">
          {cancelLabel}
        </AlertModalCancel>
        <AlertModalAction className={actionClassName} target={id} value="confirm">
          {actionLabel}
        </AlertModalAction>
      </AlertModalContent>
    </div>
  );
}
AlertModal.displayName = "AlertModal";

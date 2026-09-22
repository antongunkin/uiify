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
  className,
}: AlertModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div data-part="root" data-uiify-alert-modal="">
      <AlertModalTrigger target={id}>{trigger}</AlertModalTrigger>
      <AlertModalContent
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        className={className}
        id={id}
      >
        <h2 id={titleId}>{title}</h2>
        {description === undefined ? null : <p id={descriptionId}>{description}</p>}
        {children}
        <AlertModalCancel target={id} value="cancel">
          {cancelLabel}
        </AlertModalCancel>
        <AlertModalAction target={id} value="confirm">
          {actionLabel}
        </AlertModalAction>
      </AlertModalContent>
    </div>
  );
}
AlertModal.displayName = "AlertModal";

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
  slotProps,
  ...rootProps
}: AlertModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return (
    <div data-part="root" data-uiify-alert-modal="" {...rootProps}>
      <AlertModalTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </AlertModalTrigger>
      <AlertModalContent
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        id={id}
        {...slotProps?.content}
      >
        <h2 id={titleId} data-part="title" data-uiify-alert-modal="" {...slotProps?.title}>
          {title}
        </h2>
        {description === undefined ? null : (
          <p
            id={descriptionId}
            data-part="description"
            data-uiify-alert-modal=""
            {...slotProps?.description}
          >
            {description}
          </p>
        )}
        {children}
        <AlertModalCancel target={id} value="cancel" {...slotProps?.cancel}>
          {cancelLabel}
        </AlertModalCancel>
        <AlertModalAction target={id} value="confirm" {...slotProps?.action}>
          {actionLabel}
        </AlertModalAction>
      </AlertModalContent>
    </div>
  );
}
AlertModal.displayName = "AlertModal";

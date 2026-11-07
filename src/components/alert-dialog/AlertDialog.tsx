import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./AlertDialogParts.js";
import type { AlertDialogProps } from "./types.js";
/** Convenience shell over the native parts: one trigger, one modal alertdialog, cancel and action. */
export function AlertDialog({
  id,
  trigger,
  title,
  description,
  children,
  actionLabel = "Confirm",
  cancelLabel = "Cancel",
  slotProps,
  ...rootProps
}: AlertDialogProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return (
    <div {...rootProps} className={cn("uiify-alert-dialog", rootProps.className)}>
      <AlertDialogTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        id={id}
        {...slotProps?.content}
      >
        <h2
          id={titleId}
          {...slotProps?.title}
          className={cn("uiify-alert-dialog-title", slotProps?.title?.className)}
        >
          {title}
        </h2>
        {description === undefined ? null : (
          <p
            id={descriptionId}
            {...slotProps?.description}
            className={cn("uiify-alert-dialog-description", slotProps?.description?.className)}
          >
            {description}
          </p>
        )}
        {children}
        <AlertDialogCancel target={id} value="cancel" {...slotProps?.cancel}>
          {cancelLabel}
        </AlertDialogCancel>
        <AlertDialogAction target={id} value="confirm" {...slotProps?.action}>
          {actionLabel}
        </AlertDialogAction>
      </AlertDialogContent>
    </div>
  );
}
AlertDialog.displayName = "AlertDialog";

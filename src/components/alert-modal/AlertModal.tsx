import type { ReactElement } from "react";
import { omitProps } from "../../core/slot-props.js";
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
    <div
      {...omitProps(rootProps, [
        "children",
        "dangerouslySetInnerHTML",
        "data-part",
        "data-uiify-alert-modal",
      ])}
      data-part="root"
      data-uiify-alert-modal=""
    >
      <AlertModalTrigger
        {...omitProps(slotProps?.trigger, [
          "children",
          "dangerouslySetInnerHTML",
          "type",
          "command",
          "commandfor",
          "commandFor",
          "popoverTarget",
          "popoverTargetAction",
          "data-part",
          "data-uiify-button",
          "data-uiify-alert-modal",
        ])}
        target={id}
      >
        {trigger}
      </AlertModalTrigger>
      <AlertModalContent
        {...omitProps(slotProps?.content, [
          "children",
          "dangerouslySetInnerHTML",
          "id",
          "open",
          "popover",
          "role",
          "aria-describedby",
          "aria-labelledby",
          "data-part",
          "data-uiify-alert-modal",
        ])}
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        id={id}
      >
        <h2
          {...omitProps(slotProps?.title, [
            "children",
            "dangerouslySetInnerHTML",
            "id",
            "data-part",
            "data-uiify-alert-modal",
          ])}
          id={titleId}
          data-part="title"
          data-uiify-alert-modal=""
        >
          {title}
        </h2>
        {description === undefined ? null : (
          <p
            {...omitProps(slotProps?.description, [
              "children",
              "dangerouslySetInnerHTML",
              "id",
              "data-part",
              "data-uiify-alert-modal",
            ])}
            id={descriptionId}
            data-part="description"
            data-uiify-alert-modal=""
          >
            {description}
          </p>
        )}
        {children}
        <AlertModalCancel
          {...omitProps(slotProps?.cancel, [
            "children",
            "dangerouslySetInnerHTML",
            "type",
            "value",
            "command",
            "commandfor",
            "commandFor",
            "popoverTarget",
            "popoverTargetAction",
            "data-part",
            "data-variant",
            "data-uiify-button",
            "data-uiify-alert-modal",
          ])}
          target={id}
          value="cancel"
        >
          {cancelLabel}
        </AlertModalCancel>
        <AlertModalAction
          {...omitProps(slotProps?.action, [
            "children",
            "dangerouslySetInnerHTML",
            "type",
            "value",
            "command",
            "commandfor",
            "commandFor",
            "popoverTarget",
            "popoverTargetAction",
            "data-part",
            "data-variant",
            "data-uiify-button",
            "data-uiify-alert-modal",
          ])}
          target={id}
          value="confirm"
        >
          {actionLabel}
        </AlertModalAction>
      </AlertModalContent>
    </div>
  );
}
AlertModal.displayName = "AlertModal";

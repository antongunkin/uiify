import type { ReactElement, ReactNode } from "react";
import { omitProps } from "../../core/slot-props.js";
import {
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalGrabber,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./ModalParts.js";
import type { ModalProps } from "./types.js";

const DEFAULT_MODAL_LABELS = { close: "Close" } as const;

/** `null` and `undefined` both mean "not given": no empty part, no dangling `aria-describedby`. */
function isAbsent(node: ReactNode): node is null | undefined {
  return node === null || node === undefined;
}

function safeSlotProps<T extends object>(
  props: T | undefined,
  owned: readonly string[] = [],
): T | undefined {
  return props === undefined
    ? undefined
    : omitProps(props, ["children", "dangerouslySetInnerHTML", ...owned]);
}

/**
 * Convenience shell over the native parts: one trigger and one modal `<dialog>`
 * with a header (title, description, close icon), a body and an optional footer.
 * Controlled or initially open dialogs use `ModalClientContent` from
 * `@gunkin/uiify/components/modal/client`.
 */
export function Modal({
  id,
  trigger,
  title,
  description,
  children,
  closeLabel,
  labels,
  footer,
  slotProps,
  align,
  backdrop,
  dismiss,
  size,
  ...rootProps
}: ModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const effectiveCloseLabel = closeLabel ?? labels?.close ?? DEFAULT_MODAL_LABELS.close;

  return (
    <div
      {...safeSlotProps(rootProps, ["data-part", "data-uiify-modal"])}
      data-part="root"
      data-uiify-modal=""
    >
      <ModalTrigger
        {...safeSlotProps(slotProps?.trigger, [
          "type",
          "command",
          "commandfor",
          "popoverTarget",
          "popoverTargetAction",
          "data-part",
          "data-uiify-modal",
          "data-uiify-button",
        ])}
        target={id}
      >
        {trigger}
      </ModalTrigger>
      <ModalContent
        {...safeSlotProps(slotProps?.content, [
          "id",
          "open",
          "popover",
          "closedby",
          "data-part",
          "data-uiify-modal",
          "aria-describedby",
          "aria-labelledby",
        ])}
        align={align}
        aria-describedby={isAbsent(description) ? undefined : descriptionId}
        aria-labelledby={titleId}
        backdrop={backdrop}
        dismiss={dismiss}
        id={id}
        size={size}
      >
        <ModalGrabber
          {...safeSlotProps(slotProps?.grabber, ["data-part", "data-uiify-modal", "aria-hidden"])}
        />
        <ModalHeader {...safeSlotProps(slotProps?.header, ["data-part", "data-uiify-modal"])}>
          <ModalTitle
            {...safeSlotProps(slotProps?.title, ["id", "data-part", "data-uiify-modal"])}
            id={titleId}
          >
            {title}
          </ModalTitle>
          {isAbsent(description) ? null : (
            <ModalDescription
              {...safeSlotProps(slotProps?.description, ["id", "data-part", "data-uiify-modal"])}
              id={descriptionId}
            >
              {description}
            </ModalDescription>
          )}
          <ModalClose
            {...safeSlotProps(slotProps?.close, [
              "type",
              "command",
              "commandfor",
              "popoverTarget",
              "popoverTargetAction",
              "data-part",
              "data-uiify-modal",
              "data-uiify-button",
              "aria-label",
            ])}
            aria-label={effectiveCloseLabel}
            target={id}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.75"
              viewBox="0 0 16 16"
              width="14"
              {...safeSlotProps(slotProps?.closeIcon, ["aria-hidden", "focusable"])}
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 3l10 10M13 3L3 13" {...safeSlotProps(slotProps?.closeIconPath)} />
            </svg>
          </ModalClose>
        </ModalHeader>
        {isAbsent(children) ? null : (
          <ModalBody {...safeSlotProps(slotProps?.body, ["data-part", "data-uiify-modal"])}>
            {children}
          </ModalBody>
        )}
        {isAbsent(footer) ? null : (
          <ModalFooter {...safeSlotProps(slotProps?.footer, ["data-part", "data-uiify-modal"])}>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </div>
  );
}
Modal.displayName = "Modal";

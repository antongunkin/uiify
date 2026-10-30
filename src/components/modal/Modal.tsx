import type { ReactElement, ReactNode } from "react";
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
    <div data-part="root" data-uiify-modal="" {...rootProps}>
      <ModalTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </ModalTrigger>
      <ModalContent
        align={align}
        aria-describedby={isAbsent(description) ? undefined : descriptionId}
        aria-labelledby={titleId}
        backdrop={backdrop}
        dismiss={dismiss}
        id={id}
        size={size}
        {...slotProps?.content}
      >
        <ModalGrabber {...slotProps?.grabber} />
        <ModalHeader {...slotProps?.header}>
          <ModalTitle id={titleId} {...slotProps?.title}>
            {title}
          </ModalTitle>
          {isAbsent(description) ? null : (
            <ModalDescription id={descriptionId} {...slotProps?.description}>
              {description}
            </ModalDescription>
          )}
          <ModalClose
            aria-label={effectiveCloseLabel}
            data-size="icon"
            target={id}
            {...slotProps?.close}
          />
        </ModalHeader>
        {isAbsent(children) ? null : <ModalBody {...slotProps?.body}>{children}</ModalBody>}
        {isAbsent(footer) ? null : <ModalFooter {...slotProps?.footer}>{footer}</ModalFooter>}
      </ModalContent>
    </div>
  );
}
Modal.displayName = "Modal";

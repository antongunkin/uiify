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

const CLOSE_ICON = (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="1.75"
    viewBox="0 0 16 16"
    width="14"
  >
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

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
  closeLabel = "Close",
  footer,
  className,
  align,
  backdrop,
  dismiss,
  size,
}: ModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div data-part="root" data-uiify-modal="">
      <ModalTrigger target={id}>{trigger}</ModalTrigger>
      <ModalContent
        align={align}
        aria-describedby={isAbsent(description) ? undefined : descriptionId}
        aria-labelledby={titleId}
        backdrop={backdrop}
        className={className}
        dismiss={dismiss}
        id={id}
        size={size}
      >
        <ModalGrabber />
        <ModalHeader>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          {isAbsent(description) ? null : (
            <ModalDescription id={descriptionId}>{description}</ModalDescription>
          )}
          <ModalClose aria-label={closeLabel} target={id}>
            {CLOSE_ICON}
          </ModalClose>
        </ModalHeader>
        {isAbsent(children) ? null : <ModalBody>{children}</ModalBody>}
        {isAbsent(footer) ? null : <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </div>
  );
}
Modal.displayName = "Modal";

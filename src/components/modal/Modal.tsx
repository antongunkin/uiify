import type { ReactElement } from "react";
import { ModalClose, ModalContent, ModalTrigger } from "./ModalParts.js";
import type { ModalProps } from "./types.js";

/**
 * Convenience shell over the native parts: one trigger, one modal `<dialog>`
 * with title/description ids, one close button. Controlled or initially open
 * dialogs use `ModalClientContent` from `@gunkin/uiify/components/modal/client`.
 */
export function Modal({
  id,
  trigger,
  title,
  description,
  children,
  closeLabel = "Close",
  className,
}: ModalProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <div data-part="root" data-uiify-modal="">
      <ModalTrigger target={id}>{trigger}</ModalTrigger>
      <ModalContent
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-labelledby={titleId}
        className={className}
        id={id}
      >
        <h2 id={titleId}>{title}</h2>
        {description === undefined ? null : <p id={descriptionId}>{description}</p>}
        {children}
        <ModalClose target={id}>{closeLabel}</ModalClose>
      </ModalContent>
    </div>
  );
}
Modal.displayName = "Modal";

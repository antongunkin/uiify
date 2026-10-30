import type { ReactElement } from "react";
import type {
  ModalBodyProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalGrabberProps,
  ModalHeaderProps,
  ModalTitleProps,
} from "./types.js";

// Kept apart from ModalParts.tsx: each `displayName` assignment is a top-level side effect, so
// parts sharing a module with ModalTrigger/ModalContent/ModalClose would ship with them even
// when unused. As their own module, a bundler drops them whole, because package.json declares
// `"sideEffects": ["**/*.css"]`; widening that field would bring the unused parts back.

/** Pinned top row: title, description and the close control. */
export function ModalHeader(props: ModalHeaderProps): ReactElement {
  return <div data-part="header" data-uiify-modal="" {...props} />;
}
ModalHeader.displayName = "ModalHeader";

/** Accessible name of the dialog; reference its `id` from `aria-labelledby`. */
export function ModalTitle(props: ModalTitleProps): ReactElement {
  return <h2 data-part="title" data-uiify-modal="" {...props} />;
}
ModalTitle.displayName = "ModalTitle";

/** Supporting text; reference its `id` from `aria-describedby`. */
export function ModalDescription(props: ModalDescriptionProps): ReactElement {
  return <p data-part="description" data-uiify-modal="" {...props} />;
}
ModalDescription.displayName = "ModalDescription";

/** The scrolling region between header and footer. */
export function ModalBody(props: ModalBodyProps): ReactElement {
  return <div data-part="body" data-uiify-modal="" {...props} />;
}
ModalBody.displayName = "ModalBody";

/** Actions row pinned under the body. */
export function ModalFooter(props: ModalFooterProps): ReactElement {
  return <div data-part="footer" data-uiify-modal="" {...props} />;
}
ModalFooter.displayName = "ModalFooter";

/** Decorative drag handle shown on the mobile sheet; the swipe enhancement starts here. */
export function ModalGrabber(props: ModalGrabberProps): ReactElement {
  return <div aria-hidden="true" data-part="grabber" data-uiify-modal="" {...props} />;
}
ModalGrabber.displayName = "ModalGrabber";

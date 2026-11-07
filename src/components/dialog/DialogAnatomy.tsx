import { cn } from "../../core/class-names.js";
import type { ReactElement } from "react";
import type {
  DialogBodyProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogGrabberProps,
  DialogHeaderProps,
  DialogTitleProps,
} from "./types.js";

// Kept apart from DialogParts.tsx: each `displayName` assignment is a top-level side effect, so
// parts sharing a module with DialogTrigger/DialogContent/DialogClose would ship with them even
// when unused. As their own module, a bundler drops them whole, because package.json declares
// `"sideEffects": ["**/*.css"]`; widening that field would bring the unused parts back.

/** Pinned top row: title, description and the close control. */
export function DialogHeader(props: DialogHeaderProps): ReactElement {
  return <div {...props} className={cn("uiify-dialog-header", props.className)} />;
}
DialogHeader.displayName = "DialogHeader";

/** Accessible name of the dialog; reference its `id` from `aria-labelledby`. */
export function DialogTitle(props: DialogTitleProps): ReactElement {
  const { children, ...rest } = props;
  return (
    <h2 {...rest} className={cn("uiify-dialog-title", props.className)}>
      {children}
    </h2>
  );
}
DialogTitle.displayName = "DialogTitle";

/** Supporting text; reference its `id` from `aria-describedby`. */
export function DialogDescription(props: DialogDescriptionProps): ReactElement {
  return <p {...props} className={cn("uiify-dialog-description", props.className)} />;
}
DialogDescription.displayName = "DialogDescription";

/** The scrolling region between header and footer. */
export function DialogBody(props: DialogBodyProps): ReactElement {
  return <div {...props} className={cn("uiify-dialog-body", props.className)} />;
}
DialogBody.displayName = "DialogBody";

/** Actions row pinned under the body. */
export function DialogFooter(props: DialogFooterProps): ReactElement {
  return <div {...props} className={cn("uiify-dialog-footer", props.className)} />;
}
DialogFooter.displayName = "DialogFooter";

/** Decorative drag handle shown on the mobile sheet; the swipe enhancement starts here. */
export function DialogGrabber(props: DialogGrabberProps): ReactElement {
  return (
    <div aria-hidden="true" {...props} className={cn("uiify-dialog-grabber", props.className)} />
  );
}
DialogGrabber.displayName = "DialogGrabber";

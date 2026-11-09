import { cn } from "../../core/class-names.js";
import type { ReactElement } from "react";
import type {
  DrawerBodyProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerGrabberProps,
  DrawerHeaderProps,
  DrawerTitleProps,
} from "./types.js";

// Kept apart from DrawerNative.tsx, as DialogAnatomy.tsx is from DialogParts.tsx: a bundler drops
// the module whole when no part is used.

/** Pinned top row: title, description and the close control. */
export function DrawerHeader(props: DrawerHeaderProps): ReactElement {
  return <div {...props} className={cn("uiify-drawer-header", props.className)} />;
}
DrawerHeader.displayName = "DrawerHeader";

/** Accessible name of the drawer; reference its `id` from `aria-labelledby`. */
export function DrawerTitle(props: DrawerTitleProps): ReactElement {
  const { children, ...rest } = props;
  return (
    <h2 {...rest} className={cn("uiify-drawer-title", props.className)}>
      {children}
    </h2>
  );
}
DrawerTitle.displayName = "DrawerTitle";

/** Supporting text; reference its `id` from `aria-describedby`. */
export function DrawerDescription(props: DrawerDescriptionProps): ReactElement {
  return <p {...props} className={cn("uiify-drawer-description", props.className)} />;
}
DrawerDescription.displayName = "DrawerDescription";

/** The scrolling region between header and footer. */
export function DrawerBody(props: DrawerBodyProps): ReactElement {
  return <div {...props} className={cn("uiify-drawer-body", props.className)} />;
}
DrawerBody.displayName = "DrawerBody";

/** Actions row pinned under the body. */
export function DrawerFooter(props: DrawerFooterProps): ReactElement {
  return <div {...props} className={cn("uiify-drawer-footer", props.className)} />;
}
DrawerFooter.displayName = "DrawerFooter";

/** Decorative drag handle at the drawer's edge. */
export function DrawerGrabber(props: DrawerGrabberProps): ReactElement {
  return (
    <div aria-hidden="true" {...props} className={cn("uiify-drawer-grabber", props.className)} />
  );
}
DrawerGrabber.displayName = "DrawerGrabber";

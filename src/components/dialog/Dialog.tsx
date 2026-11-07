import { cn } from "../../core/class-names.js";
import type { ReactElement, ReactNode } from "react";
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogGrabber,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./DialogParts.js";
import type { DialogProps } from "./types.js";

const DEFAULT_MODAL_LABELS = { close: "Close" } as const;

/** `null` and `undefined` both mean "not given": no empty part, no dangling `aria-describedby`. */
function isAbsent(node: ReactNode): node is null | undefined {
  return node === null || node === undefined;
}

/**
 * Convenience shell over the native parts: one trigger and one modal `<dialog>`
 * with a header (title, description, close icon), a body and an optional footer.
 * Controlled or initially open dialogs use `DialogClientContent` from
 * `@gunkin/uiify/components/dialog/client`.
 */
export function Dialog({
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
}: DialogProps): ReactElement {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const effectiveCloseLabel = closeLabel ?? labels?.close ?? DEFAULT_MODAL_LABELS.close;

  return (
    <div {...rootProps} className={cn("uiify-dialog-root", rootProps.className)}>
      <DialogTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        align={align}
        aria-describedby={isAbsent(description) ? undefined : descriptionId}
        aria-labelledby={titleId}
        backdrop={backdrop}
        dismiss={dismiss}
        id={id}
        size={size}
        {...slotProps?.content}
      >
        <DialogGrabber {...slotProps?.grabber} />
        <DialogHeader {...slotProps?.header}>
          <DialogTitle id={titleId} {...slotProps?.title}>
            {title}
          </DialogTitle>
          {isAbsent(description) ? null : (
            <DialogDescription id={descriptionId} {...slotProps?.description}>
              {description}
            </DialogDescription>
          )}
          <DialogClose
            aria-label={effectiveCloseLabel}
            data-size="icon"
            target={id}
            {...slotProps?.close}
          />
        </DialogHeader>
        {isAbsent(children) ? null : <DialogBody {...slotProps?.body}>{children}</DialogBody>}
        {isAbsent(footer) ? null : <DialogFooter {...slotProps?.footer}>{footer}</DialogFooter>}
      </DialogContent>
    </div>
  );
}
Dialog.displayName = "Dialog";

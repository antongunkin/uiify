import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type {
  DrawerCloseProps,
  DrawerContentProps,
  DrawerProps,
  DrawerTriggerProps,
} from "./types.js";
// API informed by shadcn/ui public documentation (names and props only).
const DEFAULT_DRAWER_LABELS = { close: "Close" } as const;
export function DrawerTrigger({ target, ...props }: DrawerTriggerProps): ReactElement {
  return renderNativeInvoker("button", "uiify-drawer-trigger", "show-modal", target, props, {
    button: true,
  });
}
export function DrawerClose({ target, ...props }: DrawerCloseProps): ReactElement {
  return renderNativeInvoker("button", "uiify-drawer-close", "request-close", target, props, {
    button: true,
    variant: "ghost",
  });
}
export function DrawerContent({
  size,
  dismiss = "any",
  backdrop,
  side = "bottom",
  ...props
}: DrawerContentProps): ReactElement {
  return (
    <dialog
      closedby={dismiss}
      data-side={side}
      data-size={size}
      data-backdrop={backdrop}
      {...props}
      className={cn("uiify-drawer", "uiify-drawer-content", props.className)}
    />
  );
}
DrawerContent.displayName = "DrawerContent";
export function Drawer({
  id,
  trigger,
  title,
  description,
  children,
  closeLabel,
  labels,
  side = "bottom",
  footer,
  slotProps,
  size,
  dismiss,
  backdrop,
  ...rootProps
}: DrawerProps): ReactElement {
  const effectiveCloseLabel = closeLabel ?? labels?.close ?? DEFAULT_DRAWER_LABELS.close;
  return (
    <div data-side={side} {...rootProps} className={cn("uiify-drawer-root", rootProps.className)}>
      <DrawerTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent
        aria-describedby={
          description === null || description === undefined ? undefined : `${id}-description`
        }
        aria-labelledby={`${id}-title`}
        side={side}
        id={id}
        {...(size ? { size } : {})}
        {...(dismiss ? { dismiss } : {})}
        {...(backdrop ? { backdrop } : {})}
        {...slotProps?.content}
      >
        <div
          aria-hidden="true"
          {...slotProps?.grabber}
          className={cn("uiify-drawer-grabber", slotProps?.grabber?.className)}
        />
        <div
          {...slotProps?.header}
          className={cn("uiify-drawer-header", slotProps?.header?.className)}
        >
          <h2
            id={`${id}-title`}
            {...slotProps?.title}
            className={cn("uiify-drawer-title", slotProps?.title?.className)}
          >
            {title}
          </h2>
          {description === null || description === undefined ? null : (
            <p
              id={`${id}-description`}
              {...slotProps?.description}
              className={cn("uiify-drawer-description", slotProps?.description?.className)}
            >
              {description}
            </p>
          )}
          <DrawerClose
            aria-label={effectiveCloseLabel}
            data-size="icon"
            target={id}
            {...slotProps?.close}
          />
        </div>
        {children === null || children === undefined ? null : (
          <div {...slotProps?.body} className={cn("uiify-drawer-body", slotProps?.body?.className)}>
            {children}
          </div>
        )}
        {footer === null || footer === undefined ? null : (
          <div
            {...slotProps?.footer}
            className={cn("uiify-drawer-footer", slotProps?.footer?.className)}
          >
            {footer}
          </div>
        )}
      </DrawerContent>
    </div>
  );
}
Drawer.displayName = "Drawer";

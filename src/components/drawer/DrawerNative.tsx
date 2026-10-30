import type { ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type { DrawerProps, DrawerNativeContentProps, DrawerNativeInvokerProps } from "./types.js";
const DEFAULT_DRAWER_LABELS = { close: "Close" } as const;
export function DrawerNativeTrigger({ target, ...props }: DrawerNativeInvokerProps): ReactElement {
  return renderNativeInvoker(
    "button",
    "data-uiify-drawer",
    "trigger",
    "show-modal",
    target,
    props,
    { button: true },
  );
}
export function DrawerNativeClose({ target, ...props }: DrawerNativeInvokerProps): ReactElement {
  return renderNativeInvoker(
    "button",
    "data-uiify-drawer",
    "close",
    "request-close",
    target,
    props,
    { button: true, variant: "ghost" },
  );
}
export function DrawerNativeContent({
  size,
  dismiss = "any",
  backdrop,
  side = "bottom",
  ...props
}: DrawerNativeContentProps): ReactElement {
  return (
    <dialog
      closedby={dismiss}
      data-side={side}
      data-size={size}
      data-backdrop={backdrop}
      data-part="content"
      data-uiify-drawer=""
      {...props}
    />
  );
}
DrawerNativeContent.displayName = "DrawerNativeContent";
export function DrawerPanel({
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
    <div data-part="root" data-side={side} data-uiify-drawer="" {...rootProps}>
      <DrawerNativeTrigger target={id} {...slotProps?.trigger}>
        {trigger}
      </DrawerNativeTrigger>
      <DrawerNativeContent
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
        <div data-part="grabber" data-uiify-drawer="" aria-hidden="true" {...slotProps?.grabber} />
        <div data-part="header" data-uiify-drawer="" {...slotProps?.header}>
          <h2 data-part="title" id={`${id}-title`} data-uiify-drawer="" {...slotProps?.title}>
            {title}
          </h2>
          {description === null || description === undefined ? null : (
            <p
              data-part="description"
              id={`${id}-description`}
              data-uiify-drawer=""
              {...slotProps?.description}
            >
              {description}
            </p>
          )}
          <DrawerNativeClose
            aria-label={effectiveCloseLabel}
            data-size="icon"
            target={id}
            {...slotProps?.close}
          />
        </div>
        {children === null || children === undefined ? null : (
          <div data-part="body" data-uiify-drawer="" {...slotProps?.body}>
            {children}
          </div>
        )}
        {footer === null || footer === undefined ? null : (
          <div data-part="footer" data-uiify-drawer="" {...slotProps?.footer}>
            {footer}
          </div>
        )}
      </DrawerNativeContent>
    </div>
  );
}
DrawerPanel.displayName = "DrawerPanel";

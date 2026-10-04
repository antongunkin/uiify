import type { ReactElement } from "react";
import { renderNativeInvoker } from "@gunkin/uiify/core/render";
import type { DrawerProps, DrawerNativeContentProps, DrawerNativeInvokerProps } from "./types.js";

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
      {...props}
      closedby={dismiss}
      data-side={side}
      data-size={size}
      data-backdrop={backdrop}
      data-part="content"
      data-uiify-drawer=""
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
  closeLabel = "Close",
  side = "bottom",
  className,
  footer,
  size,
  dismiss,
  backdrop,
}: DrawerProps): ReactElement {
  return (
    <div data-part="root" data-side={side} data-uiify-drawer="">
      <DrawerNativeTrigger target={id}>{trigger}</DrawerNativeTrigger>
      <DrawerNativeContent
        aria-describedby={
          description === null || description === undefined ? undefined : `${id}-description`
        }
        aria-labelledby={`${id}-title`}
        className={className}
        side={side}
        id={id}
        {...(size ? { size } : {})}
        {...(dismiss ? { dismiss } : {})}
        {...(backdrop ? { backdrop } : {})}
      >
        <div data-part="grabber" data-uiify-drawer="" aria-hidden="true" />
        <div data-part="header" data-uiify-drawer="">
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {description === null || description === undefined ? null : (
            <p data-part="description" id={`${id}-description`}>
              {description}
            </p>
          )}
          <DrawerNativeClose target={id} aria-label={closeLabel}>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </DrawerNativeClose>
        </div>
        {children === null || children === undefined ? null : (
          <div data-part="body" data-uiify-drawer="">
            {children}
          </div>
        )}
        {footer === null || footer === undefined ? null : (
          <div data-part="footer" data-uiify-drawer="">
            {footer}
          </div>
        )}
      </DrawerNativeContent>
    </div>
  );
}
DrawerPanel.displayName = "DrawerPanel";

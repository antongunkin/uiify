import type { ReactElement } from "react";
import { omitProps } from "../../core/slot-props.js";
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
    omitProps(props, [
      "type",
      "command",
      "commandfor",
      "commandFor",
      "popoverTarget",
      "popoverTargetAction",
      "data-part",
      "data-variant",
      "data-uiify-button",
      "data-uiify-drawer",
      "dangerouslySetInnerHTML",
    ]),
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
    omitProps(props, [
      "type",
      "command",
      "commandfor",
      "commandFor",
      "popoverTarget",
      "popoverTargetAction",
      "data-part",
      "data-variant",
      "data-uiify-button",
      "data-uiify-drawer",
      "dangerouslySetInnerHTML",
    ]),
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
      {...omitProps(props, [
        "dangerouslySetInnerHTML",
        "open",
        "popover",
        "closedby",
        "data-side",
        "data-size",
        "data-backdrop",
        "data-part",
        "data-uiify-drawer",
      ])}
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
    <div
      {...omitProps(rootProps, [
        "children",
        "dangerouslySetInnerHTML",
        "data-part",
        "data-side",
        "data-uiify-drawer",
      ])}
      data-part="root"
      data-side={side}
      data-uiify-drawer=""
    >
      <DrawerNativeTrigger
        {...omitProps(slotProps?.trigger, [
          "children",
          "dangerouslySetInnerHTML",
          "type",
          "command",
          "commandfor",
          "commandFor",
          "popoverTarget",
          "popoverTargetAction",
          "data-part",
          "data-variant",
          "data-uiify-button",
          "data-uiify-drawer",
        ])}
        target={id}
      >
        {trigger}
      </DrawerNativeTrigger>
      <DrawerNativeContent
        {...omitProps(slotProps?.content, [
          "children",
          "dangerouslySetInnerHTML",
          "size",
          "dismiss",
          "side",
          "backdrop",
          "id",
          "open",
          "popover",
          "closedby",
          "aria-describedby",
          "aria-labelledby",
          "aria-modal",
          "data-part",
          "data-side",
          "data-size",
          "data-backdrop",
          "data-state",
          "data-snap-enabled",
          "data-uiify-drawer",
        ])}
        aria-describedby={
          description === null || description === undefined ? undefined : `${id}-description`
        }
        aria-labelledby={`${id}-title`}
        side={side}
        id={id}
        {...(size ? { size } : {})}
        {...(dismiss ? { dismiss } : {})}
        {...(backdrop ? { backdrop } : {})}
      >
        <div
          {...omitProps(slotProps?.grabber, [
            "children",
            "dangerouslySetInnerHTML",
            "aria-hidden",
            "data-part",
            "data-uiify-drawer",
          ])}
          data-part="grabber"
          data-uiify-drawer=""
          aria-hidden="true"
        />
        <div
          {...omitProps(slotProps?.header, [
            "children",
            "dangerouslySetInnerHTML",
            "data-part",
            "data-uiify-drawer",
          ])}
          data-part="header"
          data-uiify-drawer=""
        >
          <h2
            {...omitProps(slotProps?.title, [
              "children",
              "dangerouslySetInnerHTML",
              "id",
              "data-part",
              "data-uiify-drawer",
            ])}
            data-part="title"
            id={`${id}-title`}
            data-uiify-drawer=""
          >
            {title}
          </h2>
          {description === null || description === undefined ? null : (
            <p
              {...omitProps(slotProps?.description, [
                "children",
                "dangerouslySetInnerHTML",
                "id",
                "data-part",
                "data-uiify-drawer",
              ])}
              data-part="description"
              id={`${id}-description`}
              data-uiify-drawer=""
            >
              {description}
            </p>
          )}
          <DrawerNativeClose
            {...omitProps(slotProps?.close, [
              "children",
              "dangerouslySetInnerHTML",
              "type",
              "command",
              "commandfor",
              "commandFor",
              "popoverTarget",
              "popoverTargetAction",
              "aria-label",
              "data-part",
              "data-variant",
              "data-uiify-button",
              "data-uiify-drawer",
            ])}
            target={id}
            aria-label={effectiveCloseLabel}
          >
            <svg
              fill="none"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              {...omitProps(slotProps?.closeIcon, [
                "children",
                "dangerouslySetInnerHTML",
                "aria-hidden",
                "focusable",
              ])}
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 3l10 10M13 3L3 13"
                {...omitProps(slotProps?.closeIconPath, ["children", "dangerouslySetInnerHTML"])}
              />
            </svg>
          </DrawerNativeClose>
        </div>
        {children === null || children === undefined ? null : (
          <div
            {...omitProps(slotProps?.body, [
              "children",
              "dangerouslySetInnerHTML",
              "data-part",
              "data-uiify-drawer",
            ])}
            data-part="body"
            data-uiify-drawer=""
          >
            {children}
          </div>
        )}
        {footer === null || footer === undefined ? null : (
          <div
            {...omitProps(slotProps?.footer, [
              "children",
              "dangerouslySetInnerHTML",
              "data-part",
              "data-uiify-drawer",
            ])}
            data-part="footer"
            data-uiify-drawer=""
          >
            {footer}
          </div>
        )}
      </DrawerNativeContent>
    </div>
  );
}
DrawerPanel.displayName = "DrawerPanel";

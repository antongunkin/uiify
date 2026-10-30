import type { ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import type {
  ToastProviderOwnProps,
  ToastViewportOwnProps,
  ToastRootOwnProps,
  ToastTitleOwnProps,
  ToastDescriptionOwnProps,
  ToastActionProps,
  ToastCloseProps,
  ToastLabels,
} from "./types.js";

const DEFAULT_TOAST_LABELS: ToastLabels = {
  region: "Notifications",
  notification: "Notification",
  close: "Close",
};

export function ToastProvider(props: ToastProviderOwnProps): ReactElement | null {
  return (props.children ?? null) as ReactElement | null;
}

export function ToastViewport(props: ToastViewportOwnProps): ReactElement | null {
  const {
    children,
    className,
    labels,
    popover,
    ref,
    slotProps: _slotProps,
    ...consumerProps
  } = props;
  const resolvedLabels = { ...DEFAULT_TOAST_LABELS, ...labels };
  const safeConsumerProps = consumerProps;

  return (
    <section
      aria-label={resolvedLabels.region}
      data-part="viewport"
      data-testid="toast-viewport"
      data-uiify-toast=""
      {...safeConsumerProps}
      ref={ref}
      {...(popover ? { popover } : {})}
      {...(className ? { className } : {})}
    >
      {children}
    </section>
  );
}
ToastViewport.displayName = "ToastViewport";

export function ToastRoot(props: ToastRootOwnProps): ReactElement | null {
  const { toast, labels, slotProps, ...consumerRootProps } = props;
  const resolvedLabels = { ...DEFAULT_TOAST_LABELS, ...labels };
  const rootProps = consumerRootProps;
  const titleProps = resolveRepeatedSlotProps(slotProps?.title, toast.id);
  const descriptionProps = resolveRepeatedSlotProps(slotProps?.description, toast.id);
  const actionProps = resolveRepeatedSlotProps(slotProps?.action, toast.id);
  const closeProps = resolveRepeatedSlotProps(slotProps?.close, toast.id);

  /* oxlint-disable jsx-a11y/prefer-tag-over-role -- a toast is a labeled group, not a fieldset for form controls */
  return (
    <div
      aria-label={typeof toast.title === "string" ? toast.title : resolvedLabels.notification}
      data-part="item"
      data-state="open"
      data-uiify-toast=""
      role="group"
      {...rootProps}
    >
      {toast.title ? <ToastTitle {...titleProps}>{toast.title}</ToastTitle> : null}
      {toast.description ? (
        <ToastDescription {...descriptionProps}>{toast.description}</ToastDescription>
      ) : null}
      {toast.action ? <ToastAction {...actionProps}>{toast.action.label}</ToastAction> : null}
      <ToastClose {...closeProps} labels={resolvedLabels} />
    </div>
  );
  /* oxlint-enable jsx-a11y/prefer-tag-over-role */
}
ToastRoot.displayName = "ToastRoot";

export function ToastTitle(props: ToastTitleOwnProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  const safeConsumerProps = consumerProps;
  return useRenderElement({
    defaultTag: "div",
    props: {
      "data-part": "title",
      ...safeConsumerProps,
      className,
      children,
    },
    state: {},
  });
}

export function ToastDescription(props: ToastDescriptionOwnProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  const safeConsumerProps = consumerProps;
  return useRenderElement({
    defaultTag: "div",
    props: {
      "data-part": "description",
      ...safeConsumerProps,
      className,
      children,
    },
    state: {},
  });
}

export function ToastAction(props: ToastActionProps): ReactElement | null {
  const { children, className, onClick, ...consumerProps } = props;
  const safeConsumerProps = consumerProps;
  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      "data-part": "action",
      ...safeConsumerProps,
      className,
      onClick,
      children,
    },
    state: {},
  });
}

export function ToastClose(props: ToastCloseProps): ReactElement | null {
  const { children, className, labels, onClick, ...consumerProps } = props;
  const safeConsumerProps = consumerProps;
  const resolvedChildren = children ?? labels?.close ?? DEFAULT_TOAST_LABELS.close;
  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      "aria-label":
        typeof resolvedChildren === "string" ? resolvedChildren : DEFAULT_TOAST_LABELS.close,
      "data-part": "close",
      ...safeConsumerProps,
      className,
      onClick,
      children: resolvedChildren,
    },
    state: {},
  });
}

export const Toast = {
  Action: ToastAction,
  Close: ToastClose,
  Description: ToastDescription,
  Provider: ToastProvider,
  Root: ToastRoot,
  Title: ToastTitle,
  Viewport: ToastViewport,
};

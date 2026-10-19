import type { ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
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
  const { children, className, "aria-label": ariaLabel, labels, popover, ref } = props;
  const resolvedLabels = { ...DEFAULT_TOAST_LABELS, ...labels };

  return (
    <section
      aria-label={ariaLabel ?? resolvedLabels.region}
      data-part="viewport"
      data-testid="toast-viewport"
      data-uiify-toast=""
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
  const { toast, labels } = props;
  const resolvedLabels = { ...DEFAULT_TOAST_LABELS, ...labels };

  return (
    <fieldset
      aria-label={typeof toast.title === "string" ? toast.title : resolvedLabels.notification}
      data-part="item"
      data-state="open"
      data-uiify-toast=""
    >
      {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
      {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
      {toast.action ? <ToastAction>{toast.action.label}</ToastAction> : null}
      <ToastClose labels={resolvedLabels} />
    </fieldset>
  );
}
ToastRoot.displayName = "ToastRoot";

export function ToastTitle(props: ToastTitleOwnProps): ReactElement | null {
  const { children, className } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      "data-part": "title",
      className,
      children,
    },
    state: {},
  });
}

export function ToastDescription(props: ToastDescriptionOwnProps): ReactElement | null {
  const { children, className } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      "data-part": "description",
      className,
      children,
    },
    state: {},
  });
}

export function ToastAction(props: ToastActionProps): ReactElement | null {
  const { children, className, onClick, ...consumerProps } = props;
  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      "data-part": "action",
      className,
      onClick,
      children,
    },
    state: {},
  });
}

export function ToastClose(props: ToastCloseProps): ReactElement | null {
  const { children, className, labels, onClick, ...consumerProps } = props;
  const resolvedChildren = children ?? labels?.close ?? DEFAULT_TOAST_LABELS.close;
  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      "aria-label":
        typeof resolvedChildren === "string" ? resolvedChildren : DEFAULT_TOAST_LABELS.close,
      "data-part": "close",
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

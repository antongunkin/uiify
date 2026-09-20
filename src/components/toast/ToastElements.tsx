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
} from "./types.js";

export function ToastProvider(props: ToastProviderOwnProps): ReactElement | null {
  return (props.children ?? null) as ReactElement | null;
}

export function ToastViewport(props: ToastViewportOwnProps): ReactElement | null {
  const { children, className, "aria-label": ariaLabel = "Notifications", popover, ref } = props;

  return (
    <section
      aria-label={ariaLabel}
      data-testid="toast-viewport"
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
  const { toast } = props;

  return (
    <fieldset
      aria-label={typeof toast.title === "string" ? toast.title : "Notification"}
      data-state="open"
      data-uiify-toast-root=""
    >
      {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
      {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
      {toast.action ? <ToastAction>{toast.action.label}</ToastAction> : null}
      <ToastClose />
    </fieldset>
  );
}
ToastRoot.displayName = "ToastRoot";

export function ToastTitle(props: ToastTitleOwnProps): ReactElement | null {
  const { children, className } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      ...(className ? { className } : {}),
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
      ...(className ? { className } : {}),
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
      ...(className ? { className } : {}),
      onClick,
      children,
    },
    state: {},
  });
}

export function ToastClose(props: ToastCloseProps): ReactElement | null {
  const { children = "Close", className, onClick, ...consumerProps } = props;
  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      "aria-label": typeof children === "string" ? children : "Close",
      ...(className ? { className } : {}),
      onClick,
      children,
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

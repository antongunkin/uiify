"use client";

import {
  addTransitionType,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
} from "react";
import type { FocusEvent, KeyboardEvent, PointerEvent, ReactElement } from "react";
import { useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { createPartContext, splitRef } from "@gunkin/uiify/core";
import { VisuallyHidden } from "@gunkin/uiify/core/visually-hidden";
import { createToastStore } from "./toast-store.js";
import {
  ToastAction as ToastActionElement,
  ToastClose as ToastCloseElement,
  ToastDescription,
  ToastTitle,
  ToastViewport as ToastViewportElement,
} from "./ToastElements.js";
import type {
  ToastInput,
  ToastStore,
  ToastContextValue,
  ToastProviderOwnProps,
  ToastViewportOwnProps,
  ToastRootOwnProps,
  ToastActionProps,
  ToastCloseProps,
  ToastLabels,
} from "./types.js";

export type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionOwnProps,
  ToastInput,
  ToastLabels,
  ToastPriority,
  ToastProviderOwnProps,
  ToastRecord,
  ToastRootOwnProps,
  ToastStore,
  ToastTitleOwnProps,
  ToastViewportOwnProps,
} from "./types.js";

const DEFAULT_TOAST_LABELS: ToastLabels = {
  region: "Notifications",
  notification: "Notification",
  close: "Close",
};

/** Transition type and view-transition-class shared with behavior.css and styles/toast.css. */
const TOAST_TRANSITION = "uiify-toast";

const [ToastStoreProvider, useToastStoreContext] = createPartContext<ToastContextValue>(
  "Toast",
  "Provider",
);

export { ToastDescription, ToastTitle };

export function ToastProvider(props: ToastProviderOwnProps): ReactElement | null {
  const { children, limit = 3, labels } = props;
  const resolvedLabels = useMemo(() => ({ ...DEFAULT_TOAST_LABELS, ...labels }), [labels]);
  const storeRef = useRef<ToastStore | null>(null);
  storeRef.current ??= createToastStore({ limit });
  const store = storeRef.current;

  const dismiss = useCallback((id: string) => store.dismiss(id), [store]);
  const pause = useCallback((id: string) => store.pause(id), [store]);
  const resume = useCallback((id: string) => store.resume(id), [store]);

  const announcement = useSyncExternalStore(
    store.subscribe,
    () => store.getAnnouncement(),
    () => "",
  );
  const assertiveAnnouncement = useSyncExternalStore(
    store.subscribe,
    () => store.getAssertiveAnnouncement(),
    () => "",
  );
  const contextValue = useMemo(
    () => ({ dismiss, pause, resume, store, labels: resolvedLabels }),
    [dismiss, pause, resume, store, resolvedLabels],
  );

  return (
    <ToastStoreProvider value={contextValue}>
      {children}
      <VisuallyHidden aria-atomic="true" aria-live="polite">
        {announcement}
      </VisuallyHidden>
      <VisuallyHidden aria-atomic="true" aria-live="assertive">
        {assertiveAnnouncement}
      </VisuallyHidden>
    </ToastStoreProvider>
  );
}
ToastProvider.displayName = "ToastProvider";

export function ToastViewport(props: ToastViewportOwnProps): ReactElement | null {
  const { store } = useToastStoreContext("Viewport");
  // Not useSyncExternalStore: a store read there always commits synchronously, and
  // <ViewTransition> only animates commits made inside a Transition.
  const [toasts, setToasts] = useState(store.getServerSnapshot);
  useEffect(() => {
    const sync = () =>
      startTransition(() => {
        addTransitionType(TOAST_TRANSITION);
        setToasts(store.getSnapshot());
      });
    const unsubscribe = store.subscribe(sync);
    sync();
    return unsubscribe;
  }, [store]);
  const [consumerRef, domProps] = splitRef<HTMLElement, ToastViewportOwnProps>(props);
  const { labels } = useToastStoreContext("Viewport");
  const resolvedLabels = { ...labels, ...props.labels };
  const viewportRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(viewportRef, consumerRef);
  const hasToasts = toasts.length > 0;

  // Same technique as core/use-popover.ts: guard with .matches(":popover-open")
  // so a StrictMode double-invoke or an unrelated re-run doesn't call
  // showPopover/hidePopover on a popover already in that state (both throw).
  // try/catch covers the node having disconnected between render and effect.
  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    try {
      if (hasToasts && !viewport.matches(":popover-open")) viewport.showPopover();
      if (!hasToasts && viewport.matches(":popover-open")) viewport.hidePopover();
    } catch {
      // The node may have disconnected between render and layout effect.
    }
  }, [hasToasts]);

  return (
    <ToastViewportElement {...domProps} labels={resolvedLabels} popover="manual" ref={mergedRef}>
      {toasts.map((toast) => (
        <ViewTransition default={TOAST_TRANSITION} key={toast.id}>
          <ToastRoot toast={toast} />
        </ViewTransition>
      ))}
    </ToastViewportElement>
  );
}
ToastViewport.displayName = "ToastViewport";

export function ToastRoot(props: ToastRootOwnProps): ReactElement | null {
  const { toast, labels: labelOverrides } = props;
  const { dismiss, pause, resume, labels: providerLabels } = useToastStoreContext("Root");
  const labels = { ...providerLabels, ...labelOverrides };
  const swipeRef = useRef<PointerEvent<HTMLDivElement> | null>(null);
  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeRef.current?.pointerId === event.pointerId) swipeRef.current = null;
  };

  /* oxlint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role -- pause/swipe on toast card */
  return (
    <div
      aria-label={typeof toast.title === "string" ? toast.title : labels.notification}
      data-state="open"
      data-part="item"
      data-uiify-toast=""
      role="group"
      tabIndex={0}
      onFocus={() => pause(toast.id)}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.matches(":hover, :focus-within")) resume(toast.id);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dismiss(toast.id);
        }
      }}
      onPointerEnter={() => pause(toast.id)}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        if (!event.currentTarget.matches(":focus-within")) resume(toast.id);
      }}
      onPointerCancel={endSwipe}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        if (!swipeRef.current && event.isPrimary) swipeRef.current = event;
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        const swipe = swipeRef.current;
        if (swipe?.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - swipe.clientX;
        const deltaY = event.clientY - swipe.clientY;
        if (Math.abs(deltaX) <= 80 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        dismiss(toast.id);
      }}
      onPointerUp={endSwipe}
    >
      {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
      {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
      {toast.action ? (
        <ToastAction
          onClick={() => {
            toast.action?.onClick();
            dismiss(toast.id);
          }}
        >
          {toast.action.label}
        </ToastAction>
      ) : null}
      <ToastClose labels={labels} onClick={() => dismiss(toast.id)} />
    </div>
  );
  /* oxlint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role */
}
ToastRoot.displayName = "ToastRoot";

export function ToastAction(props: ToastActionProps): ReactElement | null {
  return <ToastActionElement {...props} />;
}
ToastAction.displayName = "ToastAction";

export function ToastClose(props: ToastCloseProps): ReactElement | null {
  return <ToastCloseElement {...props} />;
}
ToastClose.displayName = "ToastClose";

export function useToast() {
  const { dismiss, store } = useToastStoreContext("useToast");
  return {
    dismiss,
    toast(input: ToastInput) {
      return store.enqueue(input);
    },
  };
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

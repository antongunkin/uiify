"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
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
} from "./types.js";

export type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionOwnProps,
  ToastInput,
  ToastPriority,
  ToastProviderOwnProps,
  ToastRecord,
  ToastRootOwnProps,
  ToastStore,
  ToastTitleOwnProps,
  ToastViewportOwnProps,
} from "./types.js";

const SWIPE_DISMISS_THRESHOLD = 80;

const [ToastStoreProvider, useToastStoreContext] = createPartContext<ToastContextValue>(
  "Toast",
  "Provider",
);

export { ToastDescription, ToastTitle };

export function ToastProvider(props: ToastProviderOwnProps): ReactElement | null {
  const { children, limit = 3 } = props;
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
    () => ({ dismiss, pause, resume, store }),
    [dismiss, pause, resume, store],
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
  const toasts = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const [consumerRef, domProps] = splitRef<HTMLElement, ToastViewportOwnProps>(props);
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
    <ToastViewportElement {...domProps} popover="manual" ref={mergedRef}>
      {toasts.map((toast) => (
        <ToastRoot key={toast.id} toast={toast} />
      ))}
    </ToastViewportElement>
  );
}
ToastViewport.displayName = "ToastViewport";

export function ToastRoot(props: ToastRootOwnProps): ReactElement | null {
  const { toast } = props;
  const { dismiss, pause, resume } = useToastStoreContext("Root");
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const swipingRef = useRef(false);

  /* oxlint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role -- pause/swipe on toast card */
  return (
    <div
      aria-label={typeof toast.title === "string" ? toast.title : "Notification"}
      data-state="open"
      data-part="item"
      data-uiify-toast=""
      role="group"
      tabIndex={0}
      onFocus={() => pause(toast.id)}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resume(toast.id);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dismiss(toast.id);
        }
      }}
      onPointerEnter={() => pause(toast.id)}
      onPointerLeave={() => resume(toast.id)}
      onPointerCancel={() => {
        swipingRef.current = false;
      }}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        swipingRef.current = true;
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        if (!swipingRef.current) return;
        const deltaX = event.clientX - startXRef.current;
        const deltaY = event.clientY - startYRef.current;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_DISMISS_THRESHOLD) {
          swipingRef.current = false;
          dismiss(toast.id);
        }
      }}
      onPointerUp={() => {
        swipingRef.current = false;
      }}
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
      <ToastClose onClick={() => dismiss(toast.id)} />
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

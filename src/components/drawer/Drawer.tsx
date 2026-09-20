"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent, ReactElement, SyntheticEvent } from "react";
import {
  useId,
  useIsomorphicLayoutEffect,
  useLockBodyScroll,
  useMergedRefs,
  useResizeObserver,
} from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { useDialog } from "@gunkin/uiify/core/dialog";
import { createDrawerStore } from "./drawer-store.js";
import type {
  DrawerStore,
  DrawerContextValue,
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerTitleOwnProps,
  DrawerDescriptionOwnProps,
  DrawerCloseProps,
  DrawerHandleOwnProps,
} from "./client-types.js";

const [DrawerProvider, useDrawerContext] = createPartContext<DrawerContextValue>("Drawer");

export function DrawerRoot(props: DrawerRootProps): ReactElement | null {
  const {
    activeSnapPoint,
    children,
    defaultActiveSnapPoint,
    defaultOpen,
    dismissible = true,
    modal = true,
    onOpenChange,
    onSnapChange,
    open,
    side = "bottom",
    snapPoints,
  } = props;
  const contentId = useId();
  const dialog = useDialog({
    modal,
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(dialog.open);
  const storeRef = useRef<DrawerStore | null>(null);
  storeRef.current ??= createDrawerStore({
    side,
    dismissible,
    onDismiss: () => dialog.close(),
    ...(snapPoints ? { snapPoints } : {}),
    ...(activeSnapPoint !== undefined ? { activeSnapPoint } : {}),
    ...(defaultActiveSnapPoint !== undefined ? { defaultActiveSnapPoint } : {}),
    ...(onSnapChange ? { onSnapChange } : {}),
  });
  const store = storeRef.current;

  useLockBodyScroll(modal && dialog.open);

  useIsomorphicLayoutEffect(() => {
    if (activeSnapPoint !== undefined) store.syncActiveSnapPoint(activeSnapPoint);
  }, [activeSnapPoint, store]);

  useIsomorphicLayoutEffect(() => {
    if (wasOpenRef.current && !dialog.open) {
      queueMicrotask(() => triggerRef.current?.focus({ preventScroll: true }));
    }
    wasOpenRef.current = dialog.open;
  }, [dialog.open]);

  const snapEnabled = Boolean(snapPoints && snapPoints.length > 0);

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      close: dialog.close,
      contentId,
      descriptionId,
      dialogProps: dialog.dialogProps,
      dialogRef: dialog.dialogRef,
      dismissible,
      labelId,
      modal,
      open: dialog.open,
      openDialog: dialog.openDialog,
      setDescriptionId,
      setLabelId,
      side,
      snapEnabled,
      store,
      triggerRef,
    }),
    [
      contentId,
      descriptionId,
      dialog.close,
      dialog.dialogProps,
      dialog.dialogRef,
      dialog.open,
      dialog.openDialog,
      dismissible,
      labelId,
      modal,
      side,
      snapEnabled,
      store,
    ],
  );

  return <DrawerProvider value={contextValue}>{children}</DrawerProvider>;
}
DrawerRoot.displayName = "DrawerRoot";

export function DrawerTrigger(props: DrawerTriggerProps): ReactElement | null {
  const { children, className, ref, ...consumerProps } = props;
  const { contentId, open, openDialog, triggerRef } = useDrawerContext("Trigger");
  const mergedRef = useMergedRefs(triggerRef, ref);

  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      ref: mergedRef,
      type: "button",
      "aria-controls": contentId,
      "aria-expanded": open,
      "aria-haspopup": "dialog",
      onClick: composeEventHandlers(consumerProps.onClick, openDialog),
      ...(className ? { className } : {}),
      children,
    },
    state: {},
  });
}

export function DrawerContent(props: DrawerContentProps): ReactElement | null {
  const { children, className, ref, style: consumerStyle, ...consumerProps } = props;
  const {
    contentId,
    descriptionId,
    dialogProps,
    dialogRef,
    labelId,
    modal,
    open,
    side,
    snapEnabled,
    store,
  } = useDrawerContext("Content");
  const containerRef = useRef<HTMLDialogElement | null>(null);
  const mergedRef = useMergedRefs(dialogRef, containerRef, ref);
  const size = useResizeObserver(containerRef);
  const transform = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getTransform(),
    () => "",
  );
  const activeSnap = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getActiveSnapPoint(),
    () => 1,
  );

  useIsomorphicLayoutEffect(() => {
    if (!size) return;
    const vertical = side === "top" || side === "bottom";
    store.setContainerSize(vertical ? size.height : size.width);
  }, [side, size, store]);

  const styleVars =
    snapEnabled && transform
      ? ({
          "--uiify-drawer-transform": transform,
          "--uiify-drawer-snap": String(activeSnap),
        } as React.CSSProperties)
      : undefined;

  const content = useRenderElement({
    defaultTag: "dialog",
    props: {
      ...consumerProps,
      ref: mergedRef,
      id: contentId,
      "aria-describedby": descriptionId,
      "aria-labelledby": labelId,
      "aria-modal": modal ? true : undefined,
      "data-side": side,
      "data-state": open ? "open" : "closed",
      "data-snap-enabled": snapEnabled ? "" : undefined,
      ...(className ? { className } : {}),
      ...(consumerStyle || styleVars ? { style: { ...consumerStyle, ...styleVars } } : {}),
      onCancel: composeEventHandlers(
        consumerProps.onCancel,
        (event: SyntheticEvent<HTMLDialogElement>) => {
          dialogProps.onCancel?.(event);
        },
      ),
      onClose: composeEventHandlers(
        consumerProps.onClose,
        (event: SyntheticEvent<HTMLDialogElement>) => {
          dialogProps.onClose?.(event);
        },
      ),
      children,
    },
    state: { open, side },
  });

  return content;
}

export function DrawerTitle(props: DrawerTitleOwnProps): ReactElement | null {
  const { children, className } = props;
  const id = useId();
  const { setLabelId } = useDrawerContext("Title");

  useIsomorphicLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return useRenderElement({
    defaultTag: "h2",
    props: {
      id,
      ...(className ? { className } : {}),
      children,
    },
    state: {},
  });
}

export function DrawerDescription(props: DrawerDescriptionOwnProps): ReactElement | null {
  const { children, className } = props;
  const id = useId();
  const { setDescriptionId } = useDrawerContext("Description");

  useIsomorphicLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return useRenderElement({
    defaultTag: "p",
    props: {
      id,
      ...(className ? { className } : {}),
      children,
    },
    state: {},
  });
}

export function DrawerClose(props: DrawerCloseProps): ReactElement | null {
  const { children, className, ...consumerProps } = props;
  const { close } = useDrawerContext("Close");

  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      onClick: composeEventHandlers(consumerProps.onClick, () => {
        close();
      }),
      ...(className ? { className } : {}),
      children,
    },
    state: {},
  });
}

export function DrawerHandle(props: DrawerHandleOwnProps): ReactElement | null {
  const { className, onPointerCancel, onPointerDown, onPointerMove, onPointerUp } = props;
  const { side, snapEnabled, store } = useDrawerContext("Handle");
  const dragging = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.isDragging(),
    () => false,
  );

  const axis = side === "top" || side === "bottom" ? "clientY" : "clientX";

  return useRenderElement({
    defaultTag: "div",
    props: snapEnabled
      ? {
          "aria-hidden": true,
          "data-dragging": dragging ? "" : undefined,
          "data-side": side,
          ...(className ? { className } : {}),
          onPointerDown: composeEventHandlers(
            onPointerDown,
            (event: PointerEvent<HTMLDivElement>) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              store.startDrag(event[axis]);
            },
          ),
          onPointerMove: composeEventHandlers(
            onPointerMove,
            (event: PointerEvent<HTMLDivElement>) => {
              if (!store.isDragging()) return;
              store.moveDrag(event[axis]);
            },
          ),
          onPointerUp: composeEventHandlers(onPointerUp, (event: PointerEvent<HTMLDivElement>) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            store.endDrag();
          }),
          onPointerCancel: composeEventHandlers(
            onPointerCancel,
            (event: PointerEvent<HTMLDivElement>) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              store.endDrag();
            },
          ),
        }
      : { "aria-hidden": true, hidden: true },
    state: { dragging },
  });
}

export const Drawer = {
  Close: DrawerClose,
  Content: DrawerContent,
  Description: DrawerDescription,
  Handle: DrawerHandle,
  Root: DrawerRoot,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
};

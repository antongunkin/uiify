"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  ElementType,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  RefObject,
  SyntheticEvent,
} from "react";
import { useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { createPartContext, splitRef } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { RovingFocusItem, RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveDirection } from "@gunkin/uiify/core/text-direction";
import { createMenuSelectEvent } from "../internal/menu/menu-utils.js";
import { focusMenuItem } from "../internal/menu/focus-menu-item.js";
import { MenuLabel, MenuSeparator } from "../internal/menu/menu-parts.js";
import { useMenuSurface } from "../internal/menu/use-menu-surface.js";
import type { MenuSelectEvent } from "../internal/menu/types.js";
import type {
  ContextMenuContextValue,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemOwnProps,
  ContextMenuRadioItemOwnProps,
  ContextMenuSubOwnProps,
  ContextMenuSubTriggerOwnProps,
  ContextMenuSubContentOwnProps,
} from "./types.js";
export type { MenuSelectEvent };
const [ContextMenuProvider, useContextMenuContext] =
  createPartContext<ContextMenuContextValue>("ContextMenu");
export function ContextMenuRoot(props: ContextMenuRootProps): ReactElement | null {
  const { children, defaultOpen, id, onOpenChange, open, slotProps } = props;
  const virtualAnchorProps = slotProps?.virtualAnchor;
  const virtualAnchorRef = useRef<HTMLSpanElement | null>(null);
  const mergedVirtualAnchorRef = useMergedRefs(virtualAnchorRef, virtualAnchorProps?.ref);
  const [radioValue, setRadioValue] = useState<string | undefined>();
  const [pointerAnchor, setPointerAnchor] = useState(false);
  const surface = useMenuSurface({
    align: "start",
    mode: "manual",
    side: "bottom",
    ...(id !== undefined ? { id } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const { contentRef, openPopover, setTriggerElement } = surface;
  const openAtPointer = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      const coordinates = {
        "--uiify-context-menu-x": `${event.clientX}px`,
        "--uiify-context-menu-y": `${event.clientY}px`,
        ...virtualAnchorProps?.style,
      };
      for (const property of ["--uiify-context-menu-x", "--uiify-context-menu-y"] as const) {
        const value = coordinates[property];
        virtualAnchorRef.current?.style.setProperty(
          property,
          value === undefined ? "" : String(value),
        );
      }
      setPointerAnchor(true);
      setTriggerElement(event.currentTarget);
      openPopover();
      queueMicrotask(() => focusMenuItem(contentRef.current));
    },
    [contentRef, openPopover, setTriggerElement, virtualAnchorProps?.style],
  );
  const contextValue = useMemo<ContextMenuContextValue>(
    () => ({
      ...surface,
      anchorProps: pointerAnchor ? {} : surface.anchorProps,
      openAtPointer,
      radioValue,
      setRadioValue,
    }),
    [pointerAnchor, surface, openAtPointer, radioValue],
  );
  return (
    <ContextMenuProvider value={contextValue}>
      <span
        aria-hidden
        data-virtual-anchor=""
        {...(pointerAnchor ? surface.anchorProps : {})}
        {...virtualAnchorProps}
        ref={mergedVirtualAnchorRef}
        style={
          {
            position: "fixed",
            left: "var(--uiify-context-menu-x, 0px)",
            top: "var(--uiify-context-menu-y, 0px)",
            width: 0,
            height: 0,
            pointerEvents: "none",
            ...virtualAnchorProps?.style,
          } as React.CSSProperties
        }
      />
      {children}
    </ContextMenuProvider>
  );
}
ContextMenuRoot.displayName = "ContextMenuRoot";
export function ContextMenuTrigger<TAs extends ElementType = "div">(
  props: ContextMenuTriggerProps<TAs>,
): ReactElement | null {
  const { as, render, className, ...consumerProps } = props as ContextMenuTriggerProps<"div">;
  const { anchorProps, open, openAtPointer, setTriggerElement } = useContextMenuContext("Trigger");
  const [consumerRef, withoutRef] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(setTriggerElement, consumerRef);
  const { onContextMenu: consumerOnContextMenu } = withoutRef as {
    onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
  };
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...anchorProps,
      ...(className ? { className } : {}),
      ...withoutRef,
      ref: mergedRef,
      onContextMenu: composeEventHandlers(consumerOnContextMenu, openAtPointer),
    },
    render,
    state: { open },
  });
}
export function ContextMenuContent<TAs extends ElementType = "div">(
  props: ContextMenuContentProps<TAs>,
): ReactElement | null {
  const { as, className, children, render, ...consumerProps } =
    props as ContextMenuContentProps<"div">;
  const { close, contentRef, focusTrigger, open, popupProps, popupRef, positionerProps } =
    useContextMenuContext("Content");
  const [consumerRef, withoutRef] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(popupRef, contentRef, consumerRef);
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const content = contentRef.current;
    const ownerDocument = content?.ownerDocument;
    if (!content || !ownerDocument) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.composedPath().includes(content)) return;
      close();
    };
    ownerDocument.addEventListener("pointerdown", handlePointerDown, true);
    return () => ownerDocument.removeEventListener("pointerdown", handlePointerDown, true);
  }, [close, contentRef, open]);
  const { onKeyDown: consumerOnKeyDown } = withoutRef as {
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      focusTrigger();
    }
  };
  const contentProps = {
    ...popupProps,
    ...positionerProps,
    role: "menu",
    "data-part": "content",
    "data-uiify-menu": "",
    "data-state": open ? "open" : "closed",
    ...(className ? { className } : {}),
    ...withoutRef,
    ref: mergedRef,
    onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
    children,
  };
  if (render) {
    return (
      <RovingFocusRoot
        orientation="vertical"
        render={(renderProps) => render(renderProps, { open })}
        {...contentProps}
      />
    );
  }
  return <RovingFocusRoot as={as ?? "div"} orientation="vertical" {...contentProps} />;
}
ContextMenuContent.displayName = "ContextMenuContent";
export function ContextMenuItem<TAs extends ElementType = "div">(
  props: ContextMenuItemProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    className,
    disabled = false,
    onSelect,
    textValue,
    ...consumerProps
  } = props as ContextMenuItemProps<"div">;
  const { close, focusTrigger } = useContextMenuContext("Item");
  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };
  const handleSelect = (event: SyntheticEvent<HTMLElement>) => {
    if (disabled) return;
    const selectEvent = createMenuSelectEvent();
    onSelect?.(selectEvent);
    if (!selectEvent.defaultPrevented) {
      close();
      focusTrigger();
    }
    event.preventDefault();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") handleSelect(event);
  };
  const itemProps = {
    role: "menuitem",
    "data-part": "item",
    ...(className ? { className } : {}),
    ...consumerProps,
    onClick: composeEventHandlers(consumerOnClick, handleSelect),
    onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
    children,
  };
  if (render) {
    return (
      <RovingFocusItem
        disabled={disabled}
        render={render}
        {...(textValue !== undefined ? { textValue } : {})}
        {...(itemProps as object)}
      />
    );
  }
  return (
    <RovingFocusItem
      as={as ?? "div"}
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
      {...(itemProps as object)}
    />
  );
}
ContextMenuItem.displayName = "ContextMenuItem";
/**
 * Shared "activate this menu item" logic for CheckboxItem and RadioItem: run
 * the item-specific action, close the menu, and return focus to the trigger,
 * unless disabled. Not promoted to internal/menu — it has no second consumer
 * yet, so it remains local to this component.
 */
function useItemActivation(
  disabled: boolean,
  action: () => void,
  close: () => void,
  focusTrigger: () => void,
): {
  readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  readonly handleSelect: (event: SyntheticEvent<HTMLElement>) => void;
} {
  const handleSelect = (event: SyntheticEvent<HTMLElement>) => {
    if (disabled) return;
    action();
    close();
    focusTrigger();
    event.preventDefault();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") handleSelect(event);
  };
  return { handleKeyDown, handleSelect };
}
export function ContextMenuCheckboxItem(
  props: ContextMenuCheckboxItemOwnProps,
): ReactElement | null {
  const {
    checked = false,
    children,
    className,
    disabled = false,
    onCheckedChange,
    textValue,
    ...consumerProps
  } = props;
  const { close, focusTrigger } = useContextMenuContext("CheckboxItem");
  const isChecked = checked === true;
  const isIndeterminate = checked === "indeterminate";
  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };
  const { handleKeyDown, handleSelect } = useItemActivation(
    disabled,
    () => onCheckedChange?.(!isChecked),
    close,
    focusTrigger,
  );
  return (
    <RovingFocusItem
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
      {...{
        role: "menuitemcheckbox",
        "data-part": "item",
        "aria-checked": (isIndeterminate ? "mixed" : isChecked) as boolean | "mixed",
        "data-state": isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked",
        ...(className ? { className } : {}),
        ...consumerProps,
        onClick: composeEventHandlers(consumerOnClick, handleSelect),
        onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
        children,
      }}
    />
  );
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";
export function ContextMenuRadioItem(props: ContextMenuRadioItemOwnProps): ReactElement | null {
  const { children, className, disabled = false, textValue, value, ...consumerProps } = props;
  const { close, focusTrigger, radioValue, setRadioValue } = useContextMenuContext("RadioItem");
  const checked = radioValue === value;
  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };
  const { handleKeyDown, handleSelect } = useItemActivation(
    disabled,
    () => setRadioValue(value),
    close,
    focusTrigger,
  );
  return (
    <RovingFocusItem
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
      {...{
        role: "menuitemradio",
        "data-part": "item",
        "aria-checked": checked,
        "data-state": checked ? "checked" : "unchecked",
        ...(className ? { className } : {}),
        ...consumerProps,
        onClick: composeEventHandlers(consumerOnClick, handleSelect),
        onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
        children,
      }}
    />
  );
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";
interface ContextMenuSubValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly skipFocusOpenRef: RefObject<boolean>;
  readonly triggerRef: RefObject<HTMLElement | null>;
}
const [ContextMenuSubProvider, useContextMenuSubContext] = createPartContext<ContextMenuSubValue>(
  "ContextMenu",
  "Sub",
);
export function ContextMenuSub(props: ContextMenuSubOwnProps): ReactElement | null {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const skipFocusOpenRef = useRef(false);
  const value = useMemo(() => ({ open, setOpen, skipFocusOpenRef, triggerRef }), [open]);
  return <ContextMenuSubProvider value={value}>{children}</ContextMenuSubProvider>;
}
ContextMenuSub.displayName = "ContextMenuSub";
export function ContextMenuSubTrigger(props: ContextMenuSubTriggerOwnProps): ReactElement | null {
  const { children, className, disabled = false, textValue, ...consumerProps } = props;
  const sub = useContextMenuSubContext("SubTrigger");
  const [consumerRef, withoutRef] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(sub.triggerRef, consumerRef);
  const {
    onFocus: consumerOnFocus,
    onKeyDown: consumerOnKeyDown,
    onPointerEnter: consumerOnPointerEnter,
  } = withoutRef as {
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerEnter?: (event: ReactPointerEvent<HTMLElement>) => void;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const openKey = resolveDirection(event.currentTarget) === "rtl" ? "ArrowLeft" : "ArrowRight";
    if (event.key === openKey) {
      event.preventDefault();
      sub.setOpen(true);
    }
  };
  return (
    <RovingFocusItem
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
      {...{
        role: "menuitem",
        "data-part": "item",
        "aria-haspopup": "menu" as const,
        "aria-expanded": sub.open,
        ...(className ? { className } : {}),
        ...withoutRef,
        ref: mergedRef,
        onPointerEnter: composeEventHandlers(consumerOnPointerEnter, () => sub.setOpen(true)),
        onFocus: composeEventHandlers(consumerOnFocus, () => {
          if (!sub.skipFocusOpenRef.current) sub.setOpen(true);
        }),
        onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
        children,
      }}
    />
  );
}
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";
export function ContextMenuSubContent(props: ContextMenuSubContentOwnProps): ReactElement | null {
  const { children, className, onKeyDown: consumerOnKeyDown, ...consumerProps } = props;
  const sub = useContextMenuSubContext("SubContent");
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const closeKey = resolveDirection(event.currentTarget) === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (event.key !== closeKey && event.key !== "Escape") return;
    // Escape closes only this submenu, not the menu around it.
    event.preventDefault();
    event.stopPropagation();
    sub.setOpen(false);
    // The trigger opens its submenu on focus; skip that while returning focus.
    sub.skipFocusOpenRef.current = true;
    sub.triggerRef.current?.focus();
    sub.skipFocusOpenRef.current = false;
  };
  const element = useRenderElement({
    defaultTag: "div",
    props: {
      role: "menu",
      "data-part": "sub-content",
      "data-uiify-menu": "",
      "data-state": sub.open ? "open" : "closed",
      hidden: !sub.open ? true : undefined,
      ...(className ? { className } : {}),
      ...consumerProps,
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      children: sub.open ? children : null,
    },
    state: { open: sub.open },
  });
  if (!sub.open) return null;
  return element;
}
export const ContextMenuLabel = MenuLabel;
export const ContextMenuSeparator = MenuSeparator;
export const ContextMenu = {
  CheckboxItem: ContextMenuCheckboxItem,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  RadioItem: ContextMenuRadioItem,
  Root: ContextMenuRoot,
  Separator: ContextMenuSeparator,
  Sub: Object.assign(ContextMenuSub, {
    Content: ContextMenuSubContent,
    Trigger: ContextMenuSubTrigger,
  }),
  Trigger: ContextMenuTrigger,
};

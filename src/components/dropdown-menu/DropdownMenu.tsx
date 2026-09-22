"use client";

import { useCallback, useMemo, useRef } from "react";
import type {
  ElementType,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  RefObject,
  SyntheticEvent,
} from "react";
import { useControllableState, useMergedRefs } from "@gunkin/uiify/hooks";
import { createPartContext, splitRef } from "@gunkin/uiify/core";
import { useAnchorPosition } from "@gunkin/uiify/core/anchor-position";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useDirection } from "@gunkin/uiify/core/direction";
import { createHoverIntentStore } from "@gunkin/uiify/core/hover-intent-store";
import type { HoverIntentStore } from "@gunkin/uiify/core/hover-intent-store";
import type { OpenChangeDetails } from "@gunkin/uiify/core/open-change-details";
import { usePopover } from "@gunkin/uiify/core/popover";
import { RovingFocusItem, RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { createMenuSelectEvent } from "../internal/menu/menu-utils.js";
import { focusMenuItem } from "../internal/menu/focus-menu-item.js";
import { MenuGroup, MenuLabel, MenuSeparator } from "../internal/menu/menu-parts.js";
import { useMenuSurface } from "../internal/menu/use-menu-surface.js";
import { DropdownMenuBar } from "./DropdownMenuBar.js";
import type {
  DropdownMenuCheckedState,
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuContextValue,
  DropdownMenuGroupProps,
  DropdownMenuItemDescriptionProps,
  DropdownMenuItemIconProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuItemProps,
  DropdownMenuItemTextProps,
  DropdownMenuLabelProps,
  DropdownMenuOpenChangeReason,
  DropdownMenuPartProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "./types.js";

export type { MenuSelectEvent } from "./types.js";

function mapReason(reason: OpenChangeDetails["reason"]): DropdownMenuOpenChangeReason {
  if (reason === "escape-key") return "escape";
  if (reason === "focus-outside") return "focus-out";
  if (reason === "native-toggle") return "trigger-press";
  return reason;
}

const [DropdownMenuProvider, useDropdownMenuContext] =
  createPartContext<DropdownMenuContextValue>("DropdownMenu");

export function DropdownMenuRoot(props: DropdownMenuRootProps): ReactElement | null {
  const {
    children,
    className,
    defaultOpen,
    dir: localDir,
    disabled = false,
    loop = true,
    onOpenChange,
    open,
  } = props;
  const dir = useDirection(localDir);
  const surface = useMenuSurface({
    mode: "auto",
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(onOpenChange
      ? {
          onOpenChange: (next, details) =>
            onOpenChange(next, { event: details.event, reason: mapReason(details.reason) }),
        }
      : {}),
  });
  const intentRef = useRef<HoverIntentStore | null>(null);
  intentRef.current ??= createHoverIntentStore({ closeDelay: 150, openDelay: 0 });
  const intent = intentRef.current;
  const hoverEnabledRef = useRef(false);
  // Read by the scheduled close so a timer from a menu that already closed
  // cannot emit onOpenChange(false) over a sibling that opened since.
  const openRef = useRef(surface.open);
  openRef.current = surface.open;

  const cancelHoverClose = useCallback(() => intent.clearCloseTimer(), [intent]);
  const scheduleHoverClose = useCallback(() => {
    intent.scheduleClose(() => {
      if (openRef.current) surface.close();
    });
  }, [intent, surface]);

  const value = useMemo(
    () => ({
      ...surface,
      cancelHoverClose,
      dir,
      disabled,
      hoverEnabledRef,
      loop,
      scheduleHoverClose,
    }),
    [cancelHoverClose, surface, dir, disabled, loop, scheduleHoverClose],
  );
  return (
    <div className={className} data-uiify-menu="">
      <DropdownMenuProvider value={value}>{children}</DropdownMenuProvider>
    </div>
  );
}

export function DropdownMenuTrigger<TAs extends ElementType = "button">(
  props: DropdownMenuTriggerProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    className,
    openOnHover = false,
    ...consumerProps
  } = props as DropdownMenuTriggerProps<"button"> & { openOnHover?: boolean };
  const {
    anchorProps,
    cancelHoverClose,
    close,
    disabled,
    focusTrigger,
    hoverEnabledRef,
    open,
    openPopover,
    openToItem,
    scheduleHoverClose,
    setTriggerElement,
    triggerProps,
  } = useDropdownMenuContext("Trigger");
  hoverEnabledRef.current = openOnHover;
  const [consumerRef, withoutRef] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(setTriggerElement, consumerRef);
  const nativeButton = !as || as === "button";
  const {
    onClick: consumerOnClick,
    onKeyDown: consumerOnKeyDown,
    onPointerEnter: consumerOnPointerEnter,
    onPointerLeave: consumerOnPointerLeave,
  } = withoutRef as {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  };
  const internalOnClick = triggerProps.onClick as (event: MouseEvent<HTMLButtonElement>) => void;
  const handlePointerEnter = () => {
    if (disabled) return;
    cancelHoverClose();
    if (!open) openPopover();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) close();
      else openToItem(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openToItem(event.key === "ArrowUp");
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
      focusTrigger();
    }
  };
  return useRenderElement({
    as,
    defaultTag: "button",
    render,
    props: {
      ...withoutRef,
      ...triggerProps,
      ...anchorProps,
      ref: mergedRef,
      "aria-haspopup": "menu",
      "data-part": "trigger",
      "data-state": open ? "open" : "closed",
      "data-disabled": disabled ? "" : undefined,
      disabled: nativeButton && disabled ? true : undefined,
      ...(nativeButton && !triggerProps.type ? { type: "button" } : {}),
      ...(className ? { className } : {}),
      onClick: disabled ? consumerOnClick : composeEventHandlers(consumerOnClick, internalOnClick),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      ...(openOnHover && !disabled
        ? {
            onPointerEnter: composeEventHandlers(consumerOnPointerEnter, handlePointerEnter),
            onPointerLeave: composeEventHandlers(consumerOnPointerLeave, scheduleHoverClose),
          }
        : {}),
    },
    state: { open },
  });
}

export function DropdownMenuContent<TAs extends ElementType = "div">(
  props: DropdownMenuContentProps<TAs>,
): ReactElement | null {
  const {
    align = "start",
    as,
    className,
    side = "bottom",
    children,
    render,
    ...consumerProps
  } = props as DropdownMenuContentProps<"div">;
  const {
    cancelHoverClose,
    close,
    contentRef,
    dir,
    focusTrigger,
    hoverEnabledRef,
    loop,
    open,
    popupProps,
    popupRef,
    positionerProps,
    scheduleHoverClose,
  } = useDropdownMenuContext("Content");
  const [consumerRef, withoutRef] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const mergedRef = useMergedRefs(popupRef, contentRef, consumerRef);
  const {
    onKeyDown: consumerOnKeyDown,
    onPointerEnter: consumerOnPointerEnter,
    onPointerLeave: consumerOnPointerLeave,
  } = withoutRef as {
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      focusTrigger();
    }
  };
  const contentProps = {
    ...withoutRef,
    ...popupProps,
    ...positionerProps,
    ref: mergedRef,
    role: "menu",
    "data-part": "content",
    "data-align": align,
    "data-side": side,
    "data-state": open ? "open" : "closed",
    ...(className ? { className } : {}),
    onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
    ...(hoverEnabledRef.current
      ? {
          onPointerEnter: composeEventHandlers(consumerOnPointerEnter, cancelHoverClose),
          onPointerLeave: composeEventHandlers(consumerOnPointerLeave, scheduleHoverClose),
        }
      : {}),
    children,
  };
  if (render)
    return (
      <RovingFocusRoot
        direction={dir}
        loop={loop}
        orientation="vertical"
        {...contentProps}
        render={(p) => render(p, { open })}
      />
    );
  return (
    <RovingFocusRoot
      as={as ?? "div"}
      direction={dir}
      loop={loop}
      orientation="vertical"
      {...contentProps}
    />
  );
}

interface ItemActivationOptions {
  closeOnSelect: boolean;
  disabled: boolean;
  onSelect?: DropdownMenuItemProps["onSelect"];
  onStateChange?: () => void;
}
function useItemActivation({
  closeOnSelect,
  disabled,
  onSelect,
  onStateChange,
}: ItemActivationOptions) {
  const { close, focusTrigger } = useDropdownMenuContext("Item");
  const select = (event: SyntheticEvent<HTMLElement>) => {
    if (disabled) return;
    const selectEvent = createMenuSelectEvent();
    onSelect?.(selectEvent);
    if (!selectEvent.defaultPrevented) {
      onStateChange?.();
      if (closeOnSelect) {
        close();
        focusTrigger();
      }
    }
    event.preventDefault();
  };
  return {
    select,
    keyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") select(event);
    },
  };
}

function MenuItem<TAs extends ElementType>(
  props: DropdownMenuItemProps<TAs> & {
    roleName: string;
    checked?: boolean | "mixed";
    state?: string;
    onStateChange?: () => void;
    defaultClose: boolean;
  },
): ReactElement | null {
  const {
    as,
    render,
    children,
    className,
    closeOnSelect,
    disabled = false,
    onSelect,
    textValue,
    roleName,
    checked,
    state,
    onStateChange,
    defaultClose,
    ...consumerProps
  } = props as DropdownMenuItemProps<"div"> & {
    roleName: string;
    checked?: boolean | "mixed";
    state?: string;
    onStateChange?: () => void;
    defaultClose: boolean;
  };
  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  };
  const activation = useItemActivation({
    closeOnSelect: closeOnSelect ?? defaultClose,
    disabled,
    onSelect,
    ...(onStateChange ? { onStateChange } : {}),
  });
  const itemProps = {
    ...consumerProps,
    role: roleName,
    "aria-checked": checked,
    "data-part": roleName === "menuitem" ? "item" : roleName.replace("menuitem", "") + "-item",
    "data-state": state,
    ...(className ? { className } : {}),
    onClick: composeEventHandlers(consumerOnClick, activation.select),
    onKeyDown: composeEventHandlers(consumerOnKeyDown, activation.keyDown),
    children,
  };
  if (render)
    return (
      <RovingFocusItem
        disabled={disabled}
        {...(textValue !== undefined ? { textValue } : {})}
        {...(itemProps as object)}
        render={(p) => render(p, { disabled })}
      />
    );
  return (
    <RovingFocusItem
      as={as ?? "div"}
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
      {...(itemProps as object)}
    />
  );
}

export function DropdownMenuItem<TAs extends ElementType = "div">(
  props: DropdownMenuItemProps<TAs>,
): ReactElement | null {
  return <MenuItem {...props} roleName="menuitem" defaultClose />;
}

interface SelectionContextValue {
  checked: DropdownMenuCheckedState;
  kind: "checkbox" | "radio";
}
const [SelectionProvider, useSelectionContext] = createPartContext<SelectionContextValue>(
  "DropdownMenu",
  "ItemIndicator",
);

export function DropdownMenuCheckboxItem<TAs extends ElementType = "div">(
  props: DropdownMenuCheckboxItemProps<TAs>,
): ReactElement | null {
  const { checked: controlled, defaultChecked = false, onCheckedChange, ...itemProps } = props;
  const [checked, setChecked] = useControllableState<DropdownMenuCheckedState>({
    value: controlled,
    defaultValue: defaultChecked,
  });
  const next = checked === "indeterminate" ? true : !checked;
  return (
    <SelectionProvider value={{ checked, kind: "checkbox" }}>
      <MenuItem
        {...(itemProps as DropdownMenuItemProps<ElementType>)}
        roleName="menuitemcheckbox"
        checked={checked === "indeterminate" ? "mixed" : checked}
        state={checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked"}
        defaultClose={false}
        onStateChange={() => {
          setChecked(next);
          onCheckedChange?.(next);
        }}
      />
    </SelectionProvider>
  );
}

interface RadioContextValue {
  setValue: (value: string) => void;
  value: string | undefined;
}
const [RadioProvider, useRadioContext] = createPartContext<RadioContextValue>(
  "DropdownMenu",
  "RadioGroup",
);
export function DropdownMenuRadioGroup<TAs extends ElementType = "div">(
  props: DropdownMenuRadioGroupProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    defaultValue,
    onValueChange,
    value: controlled,
    ...consumerProps
  } = props as DropdownMenuRadioGroupProps<"div">;
  const [value, setValue] = useControllableState<string | undefined>({
    value: controlled,
    defaultValue,
    ...(onValueChange
      ? {
          onChange: (next) => {
            if (next !== undefined) onValueChange(next);
          },
        }
      : {}),
  });
  return (
    <RadioProvider value={{ value, setValue }}>
      {useRenderElement({
        as,
        defaultTag: "div",
        render,
        props: { ...consumerProps, role: "group", "data-part": "radio-group", children },
        state: { value },
      })}
    </RadioProvider>
  );
}
export function DropdownMenuRadioItem<TAs extends ElementType = "div">(
  props: DropdownMenuRadioItemProps<TAs>,
): ReactElement | null {
  const { value, ...itemProps } = props;
  const radio = useRadioContext("RadioItem");
  const checked = radio.value === value;
  return (
    <SelectionProvider value={{ checked, kind: "radio" }}>
      <MenuItem
        {...(itemProps as DropdownMenuItemProps<ElementType>)}
        roleName="menuitemradio"
        checked={checked}
        state={checked ? "checked" : "unchecked"}
        defaultClose={false}
        onStateChange={() => radio.setValue(value)}
      />
    </SelectionProvider>
  );
}

function Part<TAs extends ElementType = "span">({
  part,
  defaultTag,
  ...props
}: DropdownMenuPartProps<TAs> & { part: string; defaultTag: ElementType }): ReactElement | null {
  const { as, render, children, className, ...consumerProps } =
    props as DropdownMenuPartProps<"span">;
  return useRenderElement({
    as,
    defaultTag,
    render,
    props: { ...consumerProps, "data-part": part, ...(className ? { className } : {}), children },
    state: {},
  });
}
export const DropdownMenuItemIcon = <TAs extends ElementType = "span">(
  p: DropdownMenuItemIconProps<TAs>,
) => <Part {...p} part="item-icon" defaultTag="span" />;
export const DropdownMenuItemText = <TAs extends ElementType = "span">(
  p: DropdownMenuItemTextProps<TAs>,
) => <Part {...p} part="item-text" defaultTag="span" />;
export const DropdownMenuItemDescription = <TAs extends ElementType = "span">(
  p: DropdownMenuItemDescriptionProps<TAs>,
) => <Part {...p} part="item-description" defaultTag="span" />;
export const DropdownMenuShortcut = <TAs extends ElementType = "span">(
  p: DropdownMenuShortcutProps<TAs>,
) => <Part {...p} part="shortcut" defaultTag="kbd" />;
export function DropdownMenuItemIndicator<TAs extends ElementType = "span">(
  p: DropdownMenuItemIndicatorProps<TAs>,
): ReactElement | null {
  const s = useSelectionContext("ItemIndicator");
  return (
    <Part
      {...p}
      part="item-indicator"
      defaultTag="span"
      data-state={
        s.checked === "indeterminate" ? "indeterminate" : s.checked ? "checked" : "unchecked"
      }
    />
  );
}
export function DropdownMenuGroup<TAs extends ElementType = "div">(
  p: DropdownMenuGroupProps<TAs>,
): ReactElement | null {
  return <MenuGroup {...p} />;
}
export function DropdownMenuLabel<TAs extends ElementType = "div">(
  p: DropdownMenuLabelProps<TAs>,
): ReactElement | null {
  return <MenuLabel {...p} />;
}
export function DropdownMenuSeparator<TAs extends ElementType = "div">(
  p: DropdownMenuSeparatorProps<TAs>,
): ReactElement | null {
  return <MenuSeparator {...p} />;
}

interface SubValue {
  clickedRef: RefObject<boolean>;
  contentRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  popover: ReturnType<typeof usePopover>;
  anchor: ReturnType<typeof useAnchorPosition>;
  triggerRef: React.RefObject<HTMLElement | null>;
}
const [SubProvider, useSubContext] = createPartContext<SubValue>("DropdownMenu", "Sub");
export function DropdownMenuSub(props: DropdownMenuSubProps): ReactElement | null {
  const { children, defaultOpen, onOpenChange, open } = props;
  const contentRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popover = usePopover({
    mode: "auto",
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(onOpenChange
      ? {
          onOpenChange: (next, details) =>
            onOpenChange(next, { event: details.event, reason: mapReason(details.reason) }),
        }
      : {}),
  });
  const anchor = useAnchorPosition();
  const clickedRef = useRef(false);
  const value = useMemo(
    () => ({ anchor, clickedRef, contentRef, open: popover.open, popover, triggerRef }),
    [anchor, popover, clickedRef],
  );
  return <SubProvider value={value}>{children}</SubProvider>;
}
export function DropdownMenuSubTrigger<TAs extends ElementType = "button">(
  props: DropdownMenuSubTriggerProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    disabled = false,
    textValue,
    ...consumerProps
  } = props as DropdownMenuSubTriggerProps<"div">;
  const sub = useSubContext("SubTrigger");
  const root = useDropdownMenuContext("SubTrigger");
  const { clickedRef } = sub;
  const { onClick, onKeyDown, onPointerEnter, ...withoutEvents } =
    consumerProps as typeof consumerProps & {
      onClick?: (event: MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
      onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const openKey = root.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    if (event.key === openKey || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      clickedRef.current = true;
      sub.popover.openPopover();
      queueMicrotask(() => focusMenuItem(sub.contentRef.current));
    }
  };
  const handlePointerEnter = () => {
    clickedRef.current = false;
    sub.popover.openPopover();
  };
  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (clickedRef.current) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && sub.contentRef.current?.contains(nextTarget)) return;
    sub.popover.close();
  };
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    clickedRef.current = true;
    if (!sub.open) {
      (sub.popover.triggerProps.onClick as (event: MouseEvent<HTMLElement>) => void)(event);
    }
  };
  const triggerProps = {
    ...(withoutEvents as object),
    ...sub.popover.triggerProps,
    ...sub.anchor.anchorProps,
    command: "show-popover",
    ref: sub.triggerRef,
    role: "menuitem",
    "aria-haspopup": "menu" as const,
    "aria-expanded": sub.open,
    "data-part": "sub-trigger",
    "data-state": sub.open ? "open" : "closed",
    onClick: composeEventHandlers(onClick, handleClick),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
    onPointerEnter: composeEventHandlers(onPointerEnter, handlePointerEnter),
    onPointerLeave: handlePointerLeave,
    children,
  };
  if (render)
    return (
      <RovingFocusItem
        {...(triggerProps as object)}
        disabled={disabled}
        {...(textValue !== undefined ? { textValue } : {})}
        render={(p) => render(p, { disabled, open: sub.open })}
      />
    );
  return (
    <RovingFocusItem
      as={as ?? "button"}
      {...(triggerProps as object)}
      disabled={disabled}
      {...(textValue !== undefined ? { textValue } : {})}
    />
  );
}
export function DropdownMenuSubContent<TAs extends ElementType = "div">(
  props: DropdownMenuSubContentProps<TAs>,
): ReactElement | null {
  const {
    align = "start",
    as,
    render,
    side = "right",
    children,
    ...consumerProps
  } = props as DropdownMenuSubContentProps<"div">;
  const sub = useSubContext("SubContent");
  const root = useDropdownMenuContext("SubContent");
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const closeKey = root.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (event.key === closeKey || event.key === "Escape") {
      event.preventDefault();
      sub.popover.close();
      sub.triggerRef.current?.focus();
    }
  };
  const contentProps = {
    ...consumerProps,
    ...sub.popover.popupProps,
    ...sub.anchor.positionerProps,
    ref: useMergedRefs(sub.popover.popupRef, sub.contentRef),
    role: "menu",
    "data-part": "sub-content",
    "data-state": sub.open ? "open" : "closed",
    "data-side": side,
    "data-align": align,
    onKeyDown: handleKeyDown,
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (sub.clickedRef.current) return;
      const nextTarget = event.relatedTarget;
      if (!(nextTarget instanceof Node) || !sub.triggerRef.current?.contains(nextTarget)) {
        sub.popover.close();
      }
    },
    children,
  };
  if (render)
    return (
      <RovingFocusRoot
        direction={root.dir}
        loop={root.loop}
        orientation="vertical"
        {...contentProps}
        render={(p) => render(p, { open: sub.open })}
      />
    );
  return (
    <RovingFocusRoot
      as={as ?? "div"}
      direction={root.dir}
      loop={root.loop}
      orientation="vertical"
      {...contentProps}
    />
  );
}

DropdownMenuRoot.displayName = "DropdownMenuRoot";
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
DropdownMenuContent.displayName = "DropdownMenuContent";
MenuItem.displayName = "DropdownMenuItemBase";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
Part.displayName = "DropdownMenuPart";
DropdownMenuItemIcon.displayName = "DropdownMenuItemIcon";
DropdownMenuItemText.displayName = "DropdownMenuItemText";
DropdownMenuItemDescription.displayName = "DropdownMenuItemDescription";
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
DropdownMenuItemIndicator.displayName = "DropdownMenuItemIndicator";
DropdownMenuGroup.displayName = "DropdownMenuGroup";
DropdownMenuLabel.displayName = "DropdownMenuLabel";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
DropdownMenuSub.displayName = "DropdownMenuSub";
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export const DropdownMenu = {
  Bar: DropdownMenuBar,
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Item: DropdownMenuItem,
  ItemIcon: DropdownMenuItemIcon,
  ItemText: DropdownMenuItemText,
  ItemDescription: DropdownMenuItemDescription,
  Shortcut: DropdownMenuShortcut,
  Separator: DropdownMenuSeparator,
  CheckboxItem: DropdownMenuCheckboxItem,
  ItemIndicator: DropdownMenuItemIndicator,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};

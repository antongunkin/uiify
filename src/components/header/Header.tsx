"use client";

import {
  useCallback,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { Drawer } from "../drawer/Drawer.js";
import type { DrawerSide } from "../drawer/types.js";
import { useHeader } from "./use-header.js";
import { useHeaderScrollState } from "./use-header-scroll-state.js";
import type {
  HeaderMobileMode,
  HeaderRootProps,
  HeaderContextValue,
  HeaderToggleProps,
  HeaderMobileNavProps,
  HeaderCloseProps,
} from "./types.js";

export type {
  HeaderBehavior,
  HeaderCloseProps,
  HeaderMobileNavProps,
  HeaderMobileMode,
  HeaderPlacement,
  HeaderRootProps,
  HeaderToggleProps,
  UseHeaderOptions,
  UseHeaderReturn,
  UseHeaderScrollStateOptions,
  UseHeaderScrollStateReturn,
} from "./types.js";

const [HeaderProvider, useHeaderContext] = createPartContext<HeaderContextValue>("Header");

function isDrawerMode(mobileMode: HeaderMobileMode): boolean {
  return mobileMode === "drawer" || mobileMode === "sheet" || mobileMode === "fullscreen";
}

function drawerSide(mobileMode: HeaderMobileMode): DrawerSide {
  if (mobileMode === "sheet") return "bottom";
  return "left";
}

function defaultModal(mobileMode: HeaderMobileMode): boolean {
  return isDrawerMode(mobileMode);
}

function defaultLockScroll(mobileMode: HeaderMobileMode, modal: boolean): boolean {
  return isDrawerMode(mobileMode) && modal;
}

function defaultCloseOnSelect(mobileMode: HeaderMobileMode): boolean {
  return mobileMode !== "none";
}

function handleCloseOnSelect(
  event: SyntheticEvent<HTMLElement>,
  closeOnSelect: boolean,
  close: () => void,
): void {
  if (!closeOnSelect) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const activator = target.closest("a[href], button:not([disabled])");
  if (!activator || !event.currentTarget.contains(activator)) return;
  close();
}

export function HeaderRoot(props: HeaderRootProps): ReactElement | null {
  const {
    behavior = "none",
    children,
    closeOnSelect: closeOnSelectProp,
    defaultOpen,
    hidden: hiddenProp,
    lockScroll: lockScrollProp,
    mobileMode = "none",
    modal: modalProp,
    onOpenChange,
    open,
    placement = "static",
    scrolled: scrolledProp,
    ...consumerProps
  } = props;

  const modal = modalProp ?? defaultModal(mobileMode);
  const lockScroll = lockScrollProp ?? defaultLockScroll(mobileMode, modal);
  const closeOnSelect = closeOnSelectProp ?? defaultCloseOnSelect(mobileMode);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  const header = useHeader({
    closeOnSelect,
    mobileMode,
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
    ...(open !== undefined ? { open } : {}),
  });

  useIsomorphicLayoutEffect(() => {
    if (wasOpenRef.current && !header.open && isDrawerMode(mobileMode)) {
      queueMicrotask(() => toggleRef.current?.focus({ preventScroll: true }));
    }
    wasOpenRef.current = header.open;
  }, [header.open, mobileMode]);

  const contextValue = useMemo<HeaderContextValue>(
    () => ({
      ...header,
      behavior,
      hidden: hiddenProp ?? false,
      lockScroll,
      modal,
      placement,
      scrolled: scrolledProp ?? false,
      toggleRef,
    }),
    [behavior, header, hiddenProp, lockScroll, modal, placement, scrolledProp],
  );

  const rootElement = useRenderElement({
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-behavior": behavior,
      "data-hidden": hiddenProp ? "" : undefined,
      "data-lock-scroll": lockScroll && header.open && isDrawerMode(mobileMode) ? "" : undefined,
      "data-mobile-mode": mobileMode,
      "data-open": header.open ? "" : undefined,
      "data-placement": placement,
      "data-scrolled": scrolledProp ? "" : undefined,
      children,
    },
    state: {
      open: header.open,
      placement,
      behavior,
      mobileMode,
      scrolled: scrolledProp ?? false,
      hidden: hiddenProp ?? false,
    },
  });

  const tree = <HeaderProvider value={contextValue}>{rootElement}</HeaderProvider>;

  if (isDrawerMode(mobileMode)) {
    return (
      <Drawer.Root
        modal={modal}
        onOpenChange={header.setOpen}
        open={header.open}
        side={drawerSide(mobileMode)}
      >
        {tree}
      </Drawer.Root>
    );
  }

  return tree;
}
HeaderRoot.displayName = "HeaderRoot";

export function HeaderToggle(props: HeaderToggleProps): ReactElement | null {
  const {
    closeLabel = "Close navigation",
    openLabel = "Open navigation",
    ref,
    onClick,
    ...consumerProps
  } = props;
  const { getToggleProps, mobileMode, open, toggle, toggleRef } = useHeaderContext("Toggle");
  const mergedRef = useMergedRefs(toggleRef, ref);
  const dialogMode = isDrawerMode(mobileMode);

  const toggleProps = getToggleProps({
    type: "button",
    "aria-haspopup": dialogMode ? "dialog" : undefined,
    "aria-label": open ? closeLabel : openLabel,
    onClick(event: MouseEvent<HTMLButtonElement>) {
      toggle();
      onClick?.(event);
    },
  });

  return useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      ref: mergedRef,
      ...toggleProps,
    },
    state: { open },
  });
}

export function HeaderMobileNav(props: HeaderMobileNavProps): ReactElement | null {
  const { children, forceMount, onClick: consumerOnClick, ...consumerProps } = props;
  const { close, closeOnSelect, getMobileNavProps, mobileMode, open } =
    useHeaderContext("MobileNav");

  const onClick = useCallback(
    (event: SyntheticEvent<HTMLElement>) => {
      handleCloseOnSelect(event, closeOnSelect, close);
      consumerOnClick?.(event as React.MouseEvent<HTMLElement>);
    },
    [close, closeOnSelect, consumerOnClick],
  );

  const noneNav = useRenderElement({
    defaultTag: "nav",
    props: {
      ...consumerProps,
      ...getMobileNavProps({ onClick }),
      children,
    },
    state: { open },
  });

  const drawerNav = useRenderElement({
    defaultTag: "nav",
    props: {
      ...consumerProps,
      ...getMobileNavProps({
        "data-mobile-mode": mobileMode,
        "data-open": open ? "" : undefined,
        onClick,
      }),
      children,
    },
    state: { open, mobileMode },
  });

  const collapseNav = useRenderElement({
    defaultTag: "nav",
    props: {
      ...consumerProps,
      ...getMobileNavProps({
        "aria-hidden": open ? undefined : true,
        "data-mobile-mode": mobileMode,
        "data-open": open ? "" : undefined,
        hidden: open ? undefined : true,
        onClick,
      }),
      children,
    },
    state: { open, mobileMode },
  });

  if (mobileMode === "none") {
    return noneNav;
  }

  if (mobileMode === "collapse") {
    if (!open && !forceMount) {
      return null;
    }

    return collapseNav;
  }

  return <Drawer.Content>{drawerNav}</Drawer.Content>;
}
HeaderMobileNav.displayName = "HeaderMobileNav";

export function HeaderClose(props: HeaderCloseProps): ReactElement | null {
  const { children, className, onClick, ...consumerProps } = props;
  const { close, mobileMode } = useHeaderContext("Close");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    close();
    onClick?.(event);
  };

  const closeButton = useRenderElement({
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      onClick: handleClick,
      ...(className !== undefined ? { className } : {}),
      children,
    },
    state: {},
  });

  if (isDrawerMode(mobileMode)) {
    return (
      <Drawer.Close
        {...consumerProps}
        {...(className !== undefined ? { className } : {})}
        {...(onClick !== undefined ? { onClick } : {})}
      >
        {children}
      </Drawer.Close>
    );
  }

  return closeButton;
}
HeaderClose.displayName = "HeaderClose";

export const Header = {
  Close: HeaderClose,
  MobileNav: HeaderMobileNav,
  Root: HeaderRoot,
  Toggle: HeaderToggle,
};

export { useHeader, useHeaderScrollState };

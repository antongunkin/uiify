"use client";

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useDirection } from "@gunkin/uiify/core/direction";
import type { DropdownMenuBarProps } from "./types.js";

const ITEM_SELECTOR = "[data-uiify-menu-bar-item]";

function getItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

function isDisabledItem(item: HTMLElement): boolean {
  return item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled");
}

function syncTabStops(root: HTMLElement, current: HTMLElement | null): HTMLElement | null {
  const items = getItems(root);
  const enabled = items.filter((item) => !isDisabledItem(item));
  const next = current && enabled.includes(current) ? current : (enabled[0] ?? null);
  for (const item of items) item.tabIndex = next === item ? 0 : -1;
  return next;
}

function moveIndex(
  currentIndex: number,
  offset: number,
  length: number,
  loop: boolean,
): number | null {
  if (length === 0) return null;
  if (loop) return (currentIndex + offset + length) % length;
  const nextIndex = currentIndex + offset;
  return nextIndex < 0 || nextIndex >= length ? null : nextIndex;
}

/**
 * Roving focus and ArrowLeft/ArrowRight/Home/End across `data-uiify-menu-bar-item` descendants.
 * Modeled on Toolbar's own delegated-listener pattern but scoped to one axis and addressed by its
 * own marker: DropdownMenu.Trigger does not participate in @gunkin/uiify/core/roving-focus, and
 * Toolbar.Button drops any prop it does not itself destructure, so neither can host this directly.
 */
export function DropdownMenuBar(props: DropdownMenuBarProps): ReactElement {
  const { children, className, dir: localDir, loop = true } = props;
  const dir = useDirection(localDir);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    currentRef.current = syncTabStops(root, currentRef.current);
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest<HTMLElement>(ITEM_SELECTOR);
      if (!item || !root.contains(item) || isDisabledItem(item)) return;
      currentRef.current = syncTabStops(root, item);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest<HTMLElement>(ITEM_SELECTOR);
      if (!item || !root.contains(item)) return;

      const enabled = getItems(root).filter((entry) => !isDisabledItem(entry));
      const currentIndex = enabled.indexOf(item);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = enabled.length - 1;
      if (event.key === "ArrowRight") {
        nextIndex = moveIndex(currentIndex, dir === "rtl" ? -1 : 1, enabled.length, loop);
      }
      if (event.key === "ArrowLeft") {
        nextIndex = moveIndex(currentIndex, dir === "rtl" ? 1 : -1, enabled.length, loop);
      }

      if (nextIndex === null) return;
      event.preventDefault();
      const nextItem = enabled[nextIndex];
      if (!nextItem) return;
      currentRef.current = syncTabStops(root, nextItem);
      nextItem.focus();
    };

    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("keydown", handleKeyDown);
    return () => {
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("keydown", handleKeyDown);
    };
  }, [dir, loop]);

  return (
    <div {...(className ? { className } : {})} dir={dir} ref={rootRef} role="menubar">
      {children}
    </div>
  );
}
DropdownMenuBar.displayName = "DropdownMenuBar";

"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useDirectionOverride } from "@gunkin/uiify/core/direction";
import { resolveDirection } from "@gunkin/uiify/core/text-direction";

import {
  ToolbarButton as ServerToolbarButton,
  ToolbarLink as ServerToolbarLink,
  ToolbarSeparator as ServerToolbarSeparator,
  ToolbarToggleGroup as ServerToolbarToggleGroup,
} from "./ToolbarShell.js";
import type {
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarRootProps,
  ToolbarSeparatorProps,
  ToolbarToggleGroupProps,
} from "./types.js";

function getToolbarItems(root: HTMLDivElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-uiify-toolbar][data-part="item"]'));
}

function isDisabledItem(item: HTMLElement): boolean {
  return item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled");
}

function syncTabStops(root: HTMLDivElement, current: HTMLElement | null): HTMLElement | null {
  const items = getToolbarItems(root);
  const enabled = items.filter((item) => !isDisabledItem(item));
  if (enabled.length === 0) return null;

  const nextCurrent = current && enabled.includes(current) ? current : (enabled[0] ?? null);

  for (const item of items) {
    item.tabIndex = nextCurrent === item ? 0 : -1;
  }

  return nextCurrent;
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
  if (nextIndex < 0 || nextIndex >= length) return null;
  return nextIndex;
}

export function ToolbarRootClient({
  children,
  className,
  dir: localDir,
  loop = true,
  orientation = "horizontal",
  ref,
  ...consumerProps
}: ToolbarRootProps): ReactElement {
  const dir = useDirectionOverride(localDir);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLElement | null>(null);
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") {
        const cleanup = ref(node);
        if (node) {
          return () => {
            rootRef.current = null;
            if (cleanup) cleanup();
            else ref(null);
          };
        }
        return;
      }
      if (ref) ref.current = node;
      return;
    },
    [ref],
  );

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
      const item = target.closest<HTMLElement>('[data-uiify-toolbar][data-part="item"]');
      if (!item || !root.contains(item) || isDisabledItem(item)) return;
      currentRef.current = syncTabStops(root, item);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest<HTMLElement>('[data-uiify-toolbar][data-part="item"]');
      if (!item || !root.contains(item)) return;

      const enabled = getToolbarItems(root).filter((entry) => !isDisabledItem(entry));
      const currentIndex = enabled.indexOf(item);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = enabled.length - 1;
      const rtl = resolveDirection(item, dir) === "rtl";
      if (orientation !== "vertical" && event.key === "ArrowRight") {
        nextIndex = moveIndex(currentIndex, rtl ? -1 : 1, enabled.length, loop);
      }
      if (orientation !== "vertical" && event.key === "ArrowLeft") {
        nextIndex = moveIndex(currentIndex, rtl ? 1 : -1, enabled.length, loop);
      }
      if (orientation !== "horizontal" && event.key === "ArrowDown") {
        nextIndex = moveIndex(currentIndex, 1, enabled.length, loop);
      }
      if (orientation !== "horizontal" && event.key === "ArrowUp") {
        nextIndex = moveIndex(currentIndex, -1, enabled.length, loop);
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
  }, [dir, loop, orientation]);

  return (
    <div
      {...consumerProps}
      className={className}
      data-orientation={orientation}
      data-part="root"
      data-uiify-toolbar=""
      {...(dir ? { dir } : {})}
      ref={setRootRef}
      role="toolbar"
    >
      {children}
    </div>
  );
}
ToolbarRootClient.displayName = "ToolbarRootClient";

export const ToolbarRoot = ToolbarRootClient;

export function ToolbarButton(props: ToolbarButtonProps): ReactElement | null {
  return <ServerToolbarButton {...props} />;
}
ToolbarButton.displayName = "ToolbarButton";

export function ToolbarLink(props: ToolbarLinkProps): ReactElement | null {
  return <ServerToolbarLink {...props} />;
}
ToolbarLink.displayName = "ToolbarLink";

export function ToolbarSeparator(props: ToolbarSeparatorProps): ReactElement | null {
  return <ServerToolbarSeparator {...props} />;
}
ToolbarSeparator.displayName = "ToolbarSeparator";

export function ToolbarToggleGroup(props: ToolbarToggleGroupProps): ReactElement | null {
  return <ServerToolbarToggleGroup {...props} />;
}
ToolbarToggleGroup.displayName = "ToolbarToggleGroup";

export const Toolbar = {
  Button: ToolbarButton,
  Link: ToolbarLink,
  Root: ToolbarRoot,
  Separator: ToolbarSeparator,
  ToggleGroup: ToolbarToggleGroup,
};

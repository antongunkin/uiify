"use client";
import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useControllableState } from "../../../hooks/use-controllable-state.js";
import { useEventCallback } from "../../../hooks/use-event-callback.js";
import { useMergedRefs } from "../../../hooks/use-merged-refs.js";
import { useIsomorphicLayoutEffect } from "../../../hooks/use-isomorphic-layout-effect.js";
import { useRenderElement } from "../../../core/render.js";
import {
  TableOfContentsRail as NativeRail,
  TableOfContentsList as NativeList,
} from "../TableOfContents.js";
import { observeTableOfContents } from "../scrollspy.js";
import {
  TableOfContentsClientTrigger,
  TableOfContentsClientContent,
  TableOfContentsClientLink,
  TableOfContentsClientIndicator,
} from "./TableOfContentsClientParts.js";
import { TableOfContentsContext } from "./table-of-contents-context.js";
import { attachTableOfContentsInteractions } from "./table-of-contents-interactions.js";
import { attachTableOfContentsPointer } from "./table-of-contents-pointer.js";
import type { TableOfContentsClientRootProps, TableOfContentsInteractions } from "../types.js";

export function TableOfContentsClientRoot<TAs extends ElementType = "nav">(
  props: TableOfContentsClientRootProps<TAs>,
): ReactElement {
  const {
    as,
    render,
    ref,
    children,
    onClick,
    scrollSpy = true,
    scrollTarget,
    contentTarget,
    offset = 0,
    value: controlledValue,
    defaultValue = null,
    onValueChange,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    openOnHover = true,
    openDelay = 100,
    closeDelay = 200,
    ...rest
  } = props as TableOfContentsClientRootProps<"nav">;
  const rootRef = useRef<HTMLElement>(null),
    mergedRef = useMergedRefs(rootRef, ref);
  const [value, setValue] = useControllableState<string | null>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [documentUrl, setDocumentUrl] = useState<string>();
  const ready = documentUrl !== undefined;
  const interactions = useRef<TableOfContentsInteractions | null>(null);
  const getOpen = useEventCallback(() => open);
  const controlled = controlledOpen !== undefined;
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current,
      panel = root?.querySelector<HTMLElement>('[data-part="content"]');
    if (!root) return;
    setDocumentUrl(root.ownerDocument.URL);
    if (!panel) return;
    const actual = panel.matches(":popover-open");
    if (!ready && controlledOpen === undefined && actual && !open) {
      setOpen(true);
      return;
    }
    if (actual !== open) {
      if (open) panel.showPopover();
      else panel.hidePopover();
    }
  }, [open, children, controlledOpen, setOpen, ready]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controller = attachTableOfContentsInteractions({
      root,
      getOpen,
      requestOpen: setOpen,
      controlled,
      openOnHover,
      openDelay,
      closeDelay,
    });
    interactions.current = controller;
    const clearPointer = attachTableOfContentsPointer({ root });
    return () => {
      controller.destroy();
      interactions.current = null;
      clearPointer();
    };
  }, [controlled, openOnHover, openDelay, closeDelay, getOpen, setOpen, as]);
  useEffect(() => {
    if (!scrollSpy || !rootRef.current) return;
    const controller = observeTableOfContents({
      root: rootRef.current,
      scrollTarget,
      contentTarget,
      offset: Math.max(0, offset),
      onValueChange: setValue,
    });
    return () => controller.destroy();
  }, [scrollSpy, scrollTarget, contentTarget, offset, setValue]);
  const element = useRenderElement({
    as,
    render,
    defaultTag: "nav",
    props: {
      ...rest,
      children,
      ref: mergedRef,
      "data-uiify-table-of-contents": "",
      "data-state": ready && open ? "open" : "closed",
      onClick(event: ReactMouseEvent<HTMLElement>) {
        onClick?.(event);
        interactions.current?.click(event.nativeEvent);
      },
    },
    state: { value, open: ready && open },
  });
  return (
    <TableOfContentsContext value={{ value, open: ready && open, documentUrl }}>
      {element}
    </TableOfContentsContext>
  );
}
export const TableOfContents = {
  Root: TableOfContentsClientRoot,
  Trigger: TableOfContentsClientTrigger,
  Rail: NativeRail,
  Content: TableOfContentsClientContent,
  List: NativeList,
  Link: TableOfContentsClientLink,
  Indicator: TableOfContentsClientIndicator,
};

TableOfContentsClientRoot.displayName = "TableOfContentsClientRoot";

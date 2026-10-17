"use client";
import { useContext } from "react";
import type { ElementType, ReactElement } from "react";
import {
  TableOfContentsTrigger as NativeTrigger,
  TableOfContentsContent as NativeContent,
  TableOfContentsLink as NativeLink,
  TableOfContentsIndicator as NativeIndicator,
} from "../TableOfContents.js";
import { resolveTableOfContentsId } from "../scrollspy-selection.js";
import { TableOfContentsContext } from "./table-of-contents-context.js";
import type {
  TableOfContentsTriggerProps,
  TableOfContentsContentProps,
  TableOfContentsIndicatorProps,
  TableOfContentsLinkProps,
} from "../types.js";
export function TableOfContentsClientTrigger<TAs extends ElementType = "button">(
  props: TableOfContentsTriggerProps<TAs>,
): ReactElement {
  const context = useContext(TableOfContentsContext);
  return NativeTrigger({
    ...props,
    ...(context?.documentUrl !== undefined ? { "aria-expanded": context.open } : {}),
  });
}
export function TableOfContentsClientContent<TAs extends ElementType = "div">(
  props: TableOfContentsContentProps<TAs>,
): ReactElement | null {
  const context = useContext(TableOfContentsContext);
  return NativeContent({
    ...props,
    ...(context ? { "data-state": context.open ? "open" : "closed" } : {}),
  });
}
export function TableOfContentsClientLink<TAs extends ElementType = "a">(
  props: TableOfContentsLinkProps<TAs>,
): ReactElement | null {
  const context = useContext(TableOfContentsContext);
  const id = resolveTableOfContentsId(props.href, context?.documentUrl ?? "https://uiify.invalid/");
  return NativeLink({
    ...props,
    "data-uiify-toc-value": id ?? undefined,
    ...(context ? { selected: id !== null && context.value === id } : {}),
  } as TableOfContentsLinkProps<TAs>);
}
export function TableOfContentsClientIndicator<TAs extends ElementType = "span">(
  props: TableOfContentsIndicatorProps<TAs>,
): ReactElement | null {
  const context = useContext(TableOfContentsContext);
  return NativeIndicator({
    ...props,
    "data-uiify-toc-value": props.value,
    ...(context ? { selected: context.value === props.value } : {}),
  } as TableOfContentsIndicatorProps<"span">);
}

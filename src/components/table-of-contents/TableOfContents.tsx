// Informed by studying Mantine TableOfContents, Fumadocs TOC and Tocbot.
// Independently written; see NOTICE and the clean-room research notes.
import { createElement } from "react";
import type { CSSProperties, ElementType, ReactElement } from "react";
import { useRenderElement } from "../../core/render.js";
import {
  createAnchorPositionerProps,
  createAnchorTriggerProps,
} from "../../core/anchor-position/props.js";
import type {
  TableOfContentsRootProps,
  TableOfContentsTriggerProps,
  TableOfContentsRailProps,
  TableOfContentsIndicatorProps,
  TableOfContentsContentProps,
  TableOfContentsListProps,
  TableOfContentsLinkProps,
} from "./types.js";

function anchorFor(target: string): string {
  return `--uiify-toc-${Array.from(target, (c) => c.codePointAt(0)?.toString(16)).join("-")}`;
}

export function TableOfContentsRoot<TAs extends ElementType = "nav">(
  props: TableOfContentsRootProps<TAs>,
): ReactElement | null {
  const { as, render, ...rest } = props as TableOfContentsRootProps<"nav">;
  return useRenderElement({
    as,
    render,
    defaultTag: "nav",
    props: { ...rest, "data-uiify-table-of-contents": "" },
    state: {},
  });
}
export function TableOfContentsTrigger<TAs extends ElementType = "button">(
  props: TableOfContentsTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...rest } = props as TableOfContentsTriggerProps<"button">;
  return createElement(as ?? "button", {
    ...rest,
    ...createAnchorTriggerProps(anchorFor(target)),
    "data-part": "trigger",
    type: "button",
    popoverTarget: target,
    popoverTargetAction: "toggle",
  });
}
export function TableOfContentsRail<TAs extends ElementType = "span">(
  props: TableOfContentsRailProps<TAs>,
): ReactElement | null {
  const { as, render, ...rest } = props as TableOfContentsRailProps<"span">;
  return useRenderElement({
    as,
    render,
    defaultTag: "span",
    props: { ...rest, "aria-hidden": true, "data-part": "rail" },
    state: {},
  });
}
export function TableOfContentsIndicator<TAs extends ElementType = "span">(
  props: TableOfContentsIndicatorProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value: _value,
    level = 2,
    selected = false,
    style,
    ...rest
  } = props as TableOfContentsIndicatorProps<"span">;
  return useRenderElement({
    as,
    render,
    defaultTag: "span",
    props: {
      ...rest,
      style: { ...style, "--uiify-toc-level": level } as CSSProperties,
      "aria-hidden": true,
      "data-part": "indicator",
      "data-selected": selected ? "" : undefined,
    },
    state: { selected },
  });
}
export function TableOfContentsContent<TAs extends ElementType = "div">(
  props: TableOfContentsContentProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    side = "left",
    align = "start",
    id,
    ...rest
  } = props as TableOfContentsContentProps<"div">;
  return useRenderElement({
    as,
    render,
    defaultTag: "div",
    props: {
      ...rest,
      ...createAnchorPositionerProps({ anchorName: anchorFor(id), side, align }),
      id,
      popover: "auto",
      "data-part": "content",
    },
    state: {},
  });
}
export function TableOfContentsList<TAs extends ElementType = "div">(
  props: TableOfContentsListProps<TAs>,
): ReactElement | null {
  const { as, render, ...rest } = props as TableOfContentsListProps<"div">;
  return useRenderElement({
    as,
    render,
    defaultTag: "div",
    props: { ...rest, "data-part": "list" },
    state: {},
  });
}
export function TableOfContentsLink<TAs extends ElementType = "a">(
  props: TableOfContentsLinkProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    level = 2,
    selected,
    style,
    ...rest
  } = props as TableOfContentsLinkProps<"a">;
  const current = selected ?? rest["aria-current"] === "location";
  return useRenderElement({
    as,
    render,
    defaultTag: "a",
    props: {
      ...rest,
      style: { ...style, "--uiify-toc-level": level } as CSSProperties,
      "data-part": "link",
      "data-selected": current ? "" : undefined,
      ...(selected === undefined ? {} : { "aria-current": selected ? "location" : undefined }),
    },
    state: { selected: current },
  });
}

export const TableOfContents = {
  Root: TableOfContentsRoot,
  Trigger: TableOfContentsTrigger,
  Rail: TableOfContentsRail,
  Indicator: TableOfContentsIndicator,
  Content: TableOfContentsContent,
  List: TableOfContentsList,
  Link: TableOfContentsLink,
};

TableOfContentsTrigger.displayName = "TableOfContentsTrigger";

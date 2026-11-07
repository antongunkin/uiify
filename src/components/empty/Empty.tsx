import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type {
  EmptyContentProps,
  EmptyDescriptionProps,
  EmptyProps,
  EmptyTitleProps,
} from "./types.js";

export function Empty<TAs extends ElementType = "section">(
  props: EmptyProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as EmptyProps<"section">;
  return useRenderElement({
    as,
    defaultTag: "section",
    props: {
      ...consumerProps,
      className: cn("uiify-empty", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

export function EmptyTitle<TAs extends ElementType = "h2">(
  props: EmptyTitleProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as EmptyTitleProps<"h2">;
  return useRenderElement({
    as,
    defaultTag: "h2",
    props: {
      ...consumerProps,
      className: cn("uiify-empty-title", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

export function EmptyDescription<TAs extends ElementType = "p">(
  props: EmptyDescriptionProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as EmptyDescriptionProps<"p">;
  return useRenderElement({
    as,
    defaultTag: "p",
    props: {
      ...consumerProps,
      className: cn("uiify-empty-description", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

export function EmptyContent<TAs extends ElementType = "div">(
  props: EmptyContentProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as EmptyContentProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      className: cn("uiify-empty-content", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

Empty.displayName = "Empty";
EmptyTitle.displayName = "EmptyTitle";
EmptyDescription.displayName = "EmptyDescription";
EmptyContent.displayName = "EmptyContent";

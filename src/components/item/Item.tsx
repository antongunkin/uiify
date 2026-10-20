import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type {
  ItemActionsProps,
  ItemContentProps,
  ItemMediaProps,
  ItemMetadataProps,
  ItemProps,
} from "./types.js";

export function Item<TAs extends ElementType = "li">(props: ItemProps<TAs>): ReactElement | null {
  const { as, render, ...consumerProps } = props as ItemProps<"li">;
  return useRenderElement({
    as,
    defaultTag: "li",
    props: { ...consumerProps, "data-uiify-item": "" },
    render,
    state: {},
  });
}

export function ItemMedia<TAs extends ElementType = "span">(
  props: ItemMediaProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as ItemMediaProps<"span">;
  return useRenderElement({
    as,
    defaultTag: "span",
    props: { ...consumerProps, "data-uiify-item-media": "", "data-part": "media" },
    render,
    state: {},
  });
}

export function ItemContent<TAs extends ElementType = "div">(
  props: ItemContentProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as ItemContentProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, "data-uiify-item-content": "", "data-part": "content" },
    render,
    state: {},
  });
}

export function ItemMetadata<TAs extends ElementType = "div">(
  props: ItemMetadataProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as ItemMetadataProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, "data-uiify-item-metadata": "", "data-part": "metadata" },
    render,
    state: {},
  });
}

export function ItemActions<TAs extends ElementType = "div">(
  props: ItemActionsProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as ItemActionsProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, "data-uiify-item-actions": "", "data-part": "actions" },
    render,
    state: {},
  });
}

Item.displayName = "Item";
ItemMedia.displayName = "ItemMedia";
ItemContent.displayName = "ItemContent";
ItemMetadata.displayName = "ItemMetadata";
ItemActions.displayName = "ItemActions";

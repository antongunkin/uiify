import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { CardProps } from "./types.js";

export function Card<TAs extends ElementType = "div">(props: CardProps<TAs>): ReactElement | null {
  const { as, render, ...consumerProps } = props as CardProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, "data-uiify-card": "" },
    render,
    state: {},
  });
}

Card.displayName = "Card";

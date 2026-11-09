import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "./types.js";

export function Card<TAs extends ElementType = "div">(props: CardProps<TAs>): ReactElement | null {
  const { as, render, size, variant, ...consumerProps } = props as CardProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      // `default` is the unset look: no attribute, so the markup equals an omitted prop.
      ...(size !== undefined && size !== "default" ? { "data-size": size } : {}),
      ...(variant !== undefined && variant !== "default" ? { "data-variant": variant } : {}),
      ...consumerProps,
      className: cn(
        "uiify-card",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

Card.displayName = "Card";

/** One polymorphic `div` part with its identity class joined to the consumer's. */
function useCardPart(identity: string, props: CardHeaderProps): ReactElement | null {
  const { as, render, ...consumerProps } = props as CardHeaderProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, className: cn(identity, consumerProps.className) },
    render,
    state: {},
  });
}

// Part names informed by shadcn/ui public documentation (names and props only).
export function CardHeader<TAs extends ElementType = "div">(
  props: CardHeaderProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-header", props as CardHeaderProps);
}

export function CardTitle<TAs extends ElementType = "div">(
  props: CardTitleProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-title", props as CardHeaderProps);
}

export function CardDescription<TAs extends ElementType = "div">(
  props: CardDescriptionProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-description", props as CardHeaderProps);
}

export function CardAction<TAs extends ElementType = "div">(
  props: CardActionProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-action", props as CardHeaderProps);
}

export function CardContent<TAs extends ElementType = "div">(
  props: CardContentProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-content", props as CardHeaderProps);
}

export function CardFooter<TAs extends ElementType = "div">(
  props: CardFooterProps<TAs>,
): ReactElement | null {
  return useCardPart("uiify-card-footer", props as CardHeaderProps);
}

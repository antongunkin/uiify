// Card part names and `size` informed by shadcn/ui public documentation (names and props only).
import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

/** `default` is the unset look; `sm` tightens the padding, gaps and title. */
export type CardSize = "default" | "sm";

/** `default` is the unset look; `highlight` marks the one card to notice (a recommended plan). */
export type CardVariant = "default" | "highlight";

export interface CardOwnProps {
  readonly children?: ReactNode;
  /**
   * `sm` tightens the padding, gaps and title. Written as data-size; `default` renders none, the
   * same as unset.
   */
  readonly size?: CardSize;
  /**
   * `highlight` draws a primary border and a raised shadow. Written as data-variant; `default`
   * renders none, the same as unset.
   */
  readonly variant?: CardVariant;
}

export type CardProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardHeaderOwnProps {
  /** CardTitle, CardDescription and an optional CardAction. */
  readonly children?: ReactNode;
}

/** The top row: title and description, with a CardAction placed at the inline end. */
export type CardHeaderProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardHeaderOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardTitleOwnProps {
  /** Title text; use `as="h2"` or `as="h3"` for a heading. */
  readonly children?: ReactNode;
}

export type CardTitleProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardTitleOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardDescriptionOwnProps {
  /** Supporting text under the title. */
  readonly children?: ReactNode;
}

export type CardDescriptionProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardDescriptionOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardActionOwnProps {
  /** A badge or small button beside the title, at the header's inline end. */
  readonly children?: ReactNode;
}

export type CardActionProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardActionOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardContentOwnProps {
  /** The card's main content. */
  readonly children?: ReactNode;
}

export type CardContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardContentOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CardFooterOwnProps {
  /** A row of buttons or links; wraps when it does not fit. */
  readonly children?: ReactNode;
}

export type CardFooterProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardFooterOwnProps,
  Record<string, never>,
  HTMLElement
>;

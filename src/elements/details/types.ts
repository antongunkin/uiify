import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface DetailsRootOwnProps {
  readonly children?: ReactNode;
  /** Applies the native `open` attribute on first render. */
  readonly defaultOpen?: boolean;
  /**
   * Groups sibling `<details name>` into an exclusive, single-open set — the browser
   * enforces it, no JS. Must be unique per group and stable across SSR.
   */
  readonly name?: string;
  readonly disabled?: boolean;
}

/** `open` is not part of the contract — use `defaultOpen`; the browser owns state after that. */
export type DetailsRootProps = DetailsRootOwnProps &
  Omit<ComponentPropsWithRef<"details">, keyof DetailsRootOwnProps | "open">;

export interface DetailsSummaryOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  /** `data-part` value on the rendered `<summary>`; omitted entirely when not given. */
  readonly part?: string;
}

export type DetailsSummaryProps = DetailsSummaryOwnProps &
  Omit<ComponentPropsWithRef<"summary">, keyof DetailsSummaryOwnProps>;

export interface DetailsContentOwnProps {
  readonly children?: ReactNode;
  /** `data-part` value on the rendered element; omitted entirely when not given. */
  readonly part?: string;
}

export type DetailsContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DetailsContentOwnProps,
  Record<string, never>,
  HTMLElement
>;

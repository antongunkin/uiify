import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface NativeDetailsRootOwnProps {
  readonly children?: ReactNode;
  /** Applies the native `open` attribute on first render. */
  readonly defaultOpen?: boolean;
  /**
   * Groups sibling `<details name>` into an exclusive, single-open set — the browser
   * enforces it, no JS. Must be unique per group and stable across SSR.
   */
  readonly name?: string | undefined;
  readonly disabled?: boolean;
}

/** Native props may override the initial open state. */
export type NativeDetailsRootProps = NativeDetailsRootOwnProps &
  Omit<ComponentPropsWithRef<"details">, keyof NativeDetailsRootOwnProps>;

export interface NativeDetailsSummaryOwnProps {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
}

export type NativeDetailsSummaryProps = NativeDetailsSummaryOwnProps &
  Omit<ComponentPropsWithRef<"summary">, keyof NativeDetailsSummaryOwnProps>;

export interface NativeDetailsContentOwnProps {
  readonly children?: ReactNode;
}

export type NativeDetailsContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  NativeDetailsContentOwnProps,
  Record<string, never>,
  HTMLElement
>;

import type { ComponentPropsWithRef, ReactNode } from "react";
import type { GridColumns, Responsive } from "../../components/layout/index.js";
import type { HeadingLevel } from "../../components/typography/index.js";

type NodeProps<Tag extends "div" | "p" | "ul" | "h2"> = Omit<
  ComponentPropsWithRef<Tag>,
  "children" | "dangerouslySetInnerHTML"
>;

/** Native props of each node FeatureGrid renders for you. */
export interface FeatureGridSlotProps {
  readonly header?: NodeProps<"div">;
  readonly title?: NodeProps<"h2">;
  readonly description?: NodeProps<"p">;
  readonly list?: NodeProps<"ul">;
}

export interface FeatureGridOwnProps {
  /** Section id; with a title the heading gets `<id>-title` and labels the section. */
  readonly id?: string | undefined;
  /** Section heading. Leave it out when the page already titles the section. */
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  /** @default 2 */
  readonly level?: HeadingLevel | undefined;
  /** Columns; the default fits the number of features from `md` up (at most 3). */
  readonly columns?: GridColumns | Responsive<GridColumns> | undefined;
  /** `Feature` children, in reading order. */
  readonly children?: ReactNode;
  readonly slotProps?: FeatureGridSlotProps | undefined;
}

/** A labelled section with a list of equally important features. Root props go to the `section`. */
export type FeatureGridProps = FeatureGridOwnProps &
  Omit<ComponentPropsWithRef<"section">, keyof FeatureGridOwnProps | "dangerouslySetInnerHTML">;

/** Native props of each node Feature renders for you. */
export interface FeatureSlotProps {
  readonly media?: NodeProps<"div">;
  readonly header?: NodeProps<"div">;
  readonly title?: NodeProps<"h2">;
  readonly description?: NodeProps<"p">;
}

export interface FeatureOwnProps {
  /** The feature's heading. */
  readonly title: string;
  /** One or two sentences on what it does for the reader. */
  readonly description?: string | undefined;
  /** An icon or small image before the heading; mark a decorative icon `aria-hidden`. */
  readonly media?: ReactNode;
  /** Heading level of the title. @default 3 */
  readonly level?: HeadingLevel | undefined;
  readonly slotProps?: FeatureSlotProps | undefined;
}

/**
 * One feature card. `FeatureGrid` puts each in a list item; outside it the card is a plain `div`, so a design may
 * also lay features out in its own `Grid` or `Stack`. Root props go to the card.
 */
export type FeatureProps = FeatureOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    keyof FeatureOwnProps | "children" | "dangerouslySetInnerHTML"
  >;

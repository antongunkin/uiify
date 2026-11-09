import type { ComponentPropsWithRef, ReactNode } from "react";
import type { BadgeOwnProps } from "../../components/badge/index.js";
import type { GridColumns, Responsive } from "../../components/layout/index.js";
import type { HeadingLevel } from "../../components/typography/index.js";

/** The two billing periods. CSS cannot compare arbitrary values, so there are exactly two. */
export type PricingPeriod = "month" | "year";

/** One value, or one per period: `{ month: "$12", year: "$120" }` follows the period switch. */
export type PerPeriod<T> = T | { readonly month: T; readonly year: T };

/** Built-in English text; pass translations through `labels`. */
export interface PricingPlansLabels {
  /** Accessible name of the period switch. */
  readonly period: string;
}

export const defaultPricingPlansLabels: PricingPlansLabels = { period: "Billing period" };

type NodeProps<Tag extends "div" | "span" | "p" | "ul" | "h2"> = Omit<
  ComponentPropsWithRef<Tag>,
  "children" | "dangerouslySetInnerHTML"
>;

/** Native props of each node PricingPlans renders for you. */
export interface PricingPlansSlotProps {
  readonly header?: NodeProps<"div">;
  readonly title?: NodeProps<"h2">;
  readonly description?: NodeProps<"p">;
  readonly period?: Omit<NodeProps<"div">, "id" | "role" | "defaultValue">;
  readonly list?: NodeProps<"ul">;
}

export interface PricingPlansOwnProps {
  /** Section id; also derives the heading id (`<id>-title`) and the period switch (`<id>-period`). */
  readonly id: string;
  /** Section heading, labels the section. Leave it out when the page already titles it. */
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  /** @default 2 */
  readonly level?: HeadingLevel | undefined;
  /** Period switch labels. Without them there is no switch and each plan shows one price. */
  readonly periods?: { readonly month: string; readonly year: string } | undefined;
  /** @default "month" */
  readonly defaultPeriod?: PricingPeriod | undefined;
  /** Plan columns; the default fits the number of plans from `md` up (at most 4). */
  readonly columns?: GridColumns | Responsive<GridColumns> | undefined;
  readonly labels?: Partial<PricingPlansLabels> | undefined;
  /** `PricingPlan` children, in reading order. */
  readonly children?: ReactNode;
  readonly slotProps?: PricingPlansSlotProps | undefined;
}

/** A pricing section: heading, optional month/year switch (no JavaScript) and a list of plans. */
export type PricingPlansProps = PricingPlansOwnProps &
  Omit<ComponentPropsWithRef<"section">, keyof PricingPlansOwnProps | "dangerouslySetInnerHTML">;

/** Native props of each node PricingPlan renders for you. */
export interface PricingPlanSlotProps {
  readonly header?: NodeProps<"div">;
  readonly title?: NodeProps<"h2">;
  readonly badge?: NodeProps<"span"> & Pick<BadgeOwnProps, "variant" | "size">;
  readonly description?: NodeProps<"p">;
  readonly price?: NodeProps<"p">;
  readonly features?: NodeProps<"ul">;
  readonly footer?: NodeProps<"div">;
}

export interface PricingPlanOwnProps {
  /** Plan name, the card heading. */
  readonly name: string;
  readonly price: PerPeriod<string>;
  /** Shown after the price, such as "per month". */
  readonly period?: PerPeriod<string> | undefined;
  /** Who the plan suits, in one sentence. */
  readonly description?: string | undefined;
  /** Key differences, in the same order on every plan. */
  readonly features?: readonly string[] | undefined;
  /** The plan's action, named after it ("Choose Pro"); one per period when it carries the period. */
  readonly action?: PerPeriod<ReactNode> | undefined;
  /** Visible mark of a recommended plan, such as "Most popular". */
  readonly recommended?: string | undefined;
  /** Heading level of the plan name. @default 3 */
  readonly level?: HeadingLevel | undefined;
  readonly slotProps?: PricingPlanSlotProps | undefined;
}

/**
 * One plan card. `PricingPlans` puts each in a list item; outside it the card is a plain `div`. Root props go to the
 * card. A per-period value needs the period switch of `PricingPlans` to show one of its two values.
 */
export type PricingPlanProps = PricingPlanOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    keyof PricingPlanOwnProps | "children" | "dangerouslySetInnerHTML"
  >;

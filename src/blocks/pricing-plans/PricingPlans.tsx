import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { Badge } from "../../components/badge/index.js";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/card/index.js";
import { Grid, Section, Stack } from "../../components/layout/index.js";
import type { GridColumns } from "../../components/layout/index.js";
import { SegmentedControl } from "../../components/segmented-control/index.js";
import { Heading, Text } from "../../components/typography/index.js";
import type { HeadingLevel } from "../../components/typography/index.js";
import {
  defaultPricingPlansLabels,
  type PerPeriod,
  type PricingPlanProps,
  type PricingPlansProps,
} from "./types.js";

const PERIODS = ["month", "year"] as const;
const HEADING_TAGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

function isPerPeriod<T>(value: PerPeriod<T>): value is { readonly month: T; readonly year: T } {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !isValidElement(value) &&
    "month" in value &&
    "year" in value
  );
}

/** One value as is; a per-period value as both, each marked so behavior.css hides the unchecked one. */
function perPeriod(value: PerPeriod<ReactNode>): ReactNode {
  if (!isPerPeriod(value)) return value;
  return PERIODS.map((period) => (
    <span key={period} data-period={period}>
      {value[period]}
    </span>
  ));
}

/** A pricing section. Tier 0: the period switch is native radios plus a CSS `:has()` rule. */
export function PricingPlans(props: PricingPlansProps): ReactElement {
  const {
    id,
    title,
    description,
    level = 2,
    periods,
    defaultPeriod = "month",
    columns,
    labels,
    children,
    slotProps = {},
    className,
    ...rootProps
  } = props;
  const titleId = slotProps.title?.id ?? `${id}-title`;
  const count = Children.toArray(children).length;
  const fit = Math.min(Math.max(count, 1), 4) as GridColumns;
  const label = labels?.period ?? defaultPricingPlansLabels.period;

  return (
    <Section
      container
      id={id}
      aria-labelledby={title ? titleId : undefined}
      {...rootProps}
      className={cn("uiify-pricing-plans", className)}
    >
      <Stack gap="lg" align="start">
        {title || description ? (
          <Stack gap="xs" {...slotProps.header}>
            {title ? (
              <Heading level={level} {...slotProps.title} id={titleId}>
                {title}
              </Heading>
            ) : null}
            {description ? (
              <Text tone="muted" {...slotProps.description}>
                {description}
              </Text>
            ) : null}
          </Stack>
        ) : null}
        {periods ? (
          <SegmentedControl
            aria-label={label}
            {...slotProps.period}
            className={
              cn("uiify-pricing-plans-control", slotProps.period?.className) ??
              "uiify-pricing-plans-control"
            }
            id={`${id}-period`}
            items={PERIODS.map((period) => ({ value: period, label: periods[period] }))}
            defaultValue={defaultPeriod}
          />
        ) : null}
        <Grid
          as="ul"
          width="full"
          columns={columns ?? { base: 1, md: fit }}
          gap="md"
          {...slotProps.list}
          className={cn("uiify-pricing-plans-list", slotProps.list?.className)}
        >
          {/* The list owns its items: a PricingPlan is a card that also works outside the list. */}
          {Children.map(children, (child) => (
            <li className="uiify-pricing-plans-item">{child}</li>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
PricingPlans.displayName = "PricingPlans";

/** One plan card. Name, price, differences and action stay together when plans stack. */
export function PricingPlan(props: PricingPlanProps): ReactElement {
  const {
    name,
    price,
    period,
    description,
    features,
    action,
    recommended,
    level = 3,
    slotProps = {},
    className,
    ...rootProps
  } = props;
  const titleTag = HEADING_TAGS[level as HeadingLevel];

  return (
    <Card data-recommended={recommended ? "" : undefined} {...rootProps} className={className}>
      <CardHeader {...slotProps.header}>
        <CardTitle as={titleTag} {...slotProps.title}>
          {name}
        </CardTitle>
        {recommended ? (
          <CardAction>
            <Badge {...slotProps.badge}>{recommended}</Badge>
          </CardAction>
        ) : null}
        {description ? (
          <CardDescription as="p" {...slotProps.description}>
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <Stack gap="md" grow={1}>
        <Text
          {...slotProps.price}
          className={cn("uiify-pricing-plans-price", slotProps.price?.className)}
        >
          <Text as="span" size="2xl" weight="semibold">
            {perPeriod(price)}
          </Text>
          {period ? (
            <>
              {" "}
              <Text as="span" size="sm" tone="muted">
                {perPeriod(period)}
              </Text>
            </>
          ) : null}
        </Text>
        {features && features.length > 0 ? (
          <ul
            {...slotProps.features}
            className={cn("uiify-pricing-plans-features", slotProps.features?.className)}
          >
            {features.map((feature, index) => (
              <Text as="li" size="sm" key={`${index}-${feature}`}>
                {feature}
              </Text>
            ))}
          </ul>
        ) : null}
      </Stack>
      {action ? <CardFooter {...slotProps.footer}>{perPeriod(action)}</CardFooter> : null}
    </Card>
  );
}
PricingPlan.displayName = "PricingPlan";

import { Children, type ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/card/index.js";
import { Box, Grid, Section, Stack } from "../../components/layout/index.js";
import type { GridColumns } from "../../components/layout/index.js";
import { Heading, Text } from "../../components/typography/index.js";
import type { HeadingLevel } from "../../components/typography/index.js";
import type { FeatureGridProps, FeatureProps } from "./types.js";

const HEADING_TAGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

/** A labelled list of equally important features. Tier 0; one column on narrow screens. */
export function FeatureGrid(props: FeatureGridProps): ReactElement {
  const {
    id,
    title,
    description,
    level = 2,
    columns,
    children,
    slotProps = {},
    className,
    ...rootProps
  } = props;
  const titleId = slotProps.title?.id ?? (id && title ? `${id}-title` : undefined);
  const count = Children.toArray(children).length;
  const fit = Math.min(Math.max(count, 1), 3) as GridColumns;

  return (
    <Section
      container
      id={id}
      aria-labelledby={title ? titleId : undefined}
      {...rootProps}
      className={cn("uiify-feature-grid", className)}
    >
      <Stack gap="lg">
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
        <Grid
          as="ul"
          columns={columns ?? { base: 1, md: fit }}
          gap="md"
          {...slotProps.list}
          className={cn("uiify-feature-grid-list", slotProps.list?.className)}
        >
          {/* The list owns its items: a Feature is a card that also works outside the list. */}
          {Children.map(children, (child) => (
            <li className="uiify-feature-grid-item">{child}</li>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
FeatureGrid.displayName = "FeatureGrid";

/** One feature as a card: optional media, a heading and a short explanation. */
export function Feature(props: FeatureProps): ReactElement {
  const { title, description, media, level = 3, slotProps = {}, className, ...rootProps } = props;
  const hasMedia = media !== undefined && media !== null && media !== false;

  return (
    <Card {...rootProps} className={className}>
      {hasMedia ? <Box {...slotProps.media}>{media}</Box> : null}
      <CardHeader {...slotProps.header}>
        <CardTitle as={HEADING_TAGS[level as HeadingLevel]} {...slotProps.title}>
          {title}
        </CardTitle>
        {description ? (
          <CardDescription as="p" {...slotProps.description}>
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
}
Feature.displayName = "Feature";

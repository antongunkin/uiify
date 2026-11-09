import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { Box, Grid, Section, Stack } from "../../components/layout/index.js";
import { Heading, Text } from "../../components/typography/index.js";
import type { HeroProps } from "./types.js";

/**
 * The opening section of a landing page. Tier 0. Source order is text, actions, media, so narrow
 * screens read it in that order; from `md` up media sits beside the text.
 */
export function Hero(props: HeroProps): ReactElement {
  const {
    id,
    eyebrow,
    title,
    description,
    actions,
    media,
    align = "start",
    level = 1,
    slotProps = {},
    className,
    ...rootProps
  } = props;
  const titleId = slotProps.title?.id ?? (id ? `${id}-title` : undefined);
  const hasMedia = media !== undefined && media !== null && media !== false;

  return (
    <Section
      container
      id={id}
      aria-labelledby={titleId}
      {...rootProps}
      className={cn("uiify-hero", className)}
    >
      <Grid columns={{ base: 1, md: hasMedia ? 2 : 1 }} gap="xl" align="center">
        <Stack gap="md" align={align} {...slotProps.content}>
          {eyebrow ? (
            <Text size="sm" weight="medium" tone="primary" align={align} {...slotProps.eyebrow}>
              {eyebrow}
            </Text>
          ) : null}
          <Heading
            level={level}
            size="2xl"
            wrap="balance"
            align={align}
            {...slotProps.title}
            id={titleId}
          >
            {title}
          </Heading>
          {description ? (
            <Text size="lg" tone="muted" wrap="pretty" align={align} {...slotProps.description}>
              {description}
            </Text>
          ) : null}
          {actions ? (
            <Stack direction="inline" gap="sm" align="center" wrap {...slotProps.actions}>
              {actions}
            </Stack>
          ) : null}
        </Stack>
        {hasMedia ? <Box {...slotProps.media}>{media}</Box> : null}
      </Grid>
    </Section>
  );
}
Hero.displayName = "Hero";

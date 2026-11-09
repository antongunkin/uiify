import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { Card } from "../../components/card/index.js";
import { Stack } from "../../components/layout/index.js";
import { Text } from "../../components/typography/index.js";
import type { TestimonialProps } from "./types.js";

/** A customer quote: `figure` > `blockquote` + `figcaption`, so the words and speaker stay together. */
export function Testimonial(props: TestimonialProps): ReactElement {
  const {
    quote,
    name,
    byline,
    avatar,
    cite,
    variant = "plain",
    slotProps = {},
    className,
    ...rootProps
  } = props;
  const hasAvatar = avatar !== undefined && avatar !== null && avatar !== false;
  const content = (
    <>
      <blockquote
        cite={cite}
        {...slotProps.quote}
        className={cn("uiify-testimonial-body", slotProps.quote?.className)}
      >
        <Text size="lg" wrap="pretty">
          {quote}
        </Text>
      </blockquote>
      <Stack as="figcaption" direction="inline" gap="sm" align="center" {...slotProps.caption}>
        {hasAvatar ? avatar : null}
        <Stack gap="none">
          <Text as="span" size="sm" weight="medium" {...slotProps.name}>
            {name}
          </Text>
          {byline ? (
            <Text as="span" size="sm" tone="muted" {...slotProps.byline}>
              {byline}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </>
  );

  const rootClassName = cn("uiify-testimonial", className);
  return variant === "card" ? (
    <Card as="figure" {...rootProps} className={rootClassName}>
      {content}
    </Card>
  ) : (
    <Stack as="figure" gap="md" {...rootProps} className={rootClassName}>
      {content}
    </Stack>
  );
}
Testimonial.displayName = "Testimonial";

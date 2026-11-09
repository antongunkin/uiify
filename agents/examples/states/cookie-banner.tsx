import { Button, Card, Heading, Stack, Text } from "@gunkin/uiify";

export default function CookieBanner() {
  return (
    <Card as="section" aria-labelledby="cookie-title">
      <Stack
        direction={{ base: "block", md: "inline" }}
        responsive="viewport"
        gap="lg"
        align={{ base: "stretch", md: "center" }}
        justify="between"
        className="px-2 md:px-4"
      >
        <Stack gap="xs" maxWidth="prose">
          <Heading id="cookie-title" level={2} size="lg">
            We value your privacy
          </Heading>
          <Text size="sm" tone="muted">
            Essential cookies keep you signed in. With your consent we also count visits to improve
            the product. Read our{" "}
            <Text as="a" href="/privacy" size="sm">
              privacy policy
            </Text>
            .
          </Text>
        </Stack>
        <Stack
          as="form"
          action="/consent"
          method="post"
          direction="inline"
          gap="sm"
          justify="end"
          wrap
        >
          <Button type="submit" name="consent" value="essential" variant="outline">
            Essential only
          </Button>
          <Button type="submit" name="consent" value="all">
            Accept all
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

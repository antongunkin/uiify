import { Badge, Button, Card, Heading, Stack, Text } from "@gunkin/uiify";

export default function CtaBand() {
  return (
    <Card as="section" aria-labelledby="cta-title">
      <Stack
        direction={{ base: "block", md: "inline" }}
        responsive="viewport"
        justify="between"
        align={{ base: "start", md: "center" }}
        gap="lg"
        className="px-2 py-6 md:px-6"
      >
        <Stack gap="sm" maxWidth="prose">
          <Badge variant="outline">14-day free trial</Badge>
          <Heading id="cta-title" level={2} size={{ base: "2xl", md: "3xl" }} wrap="balance">
            Ship your next release on time
          </Heading>
          <Text tone="muted">
            Plan, track and announce releases in one place. No card needed to start.
          </Text>
        </Stack>
        <Stack direction="inline" gap="sm" wrap>
          <Button href="/signup" size="lg">
            Start free trial
          </Button>
          <Button href="/demo" variant="outline" size="lg">
            Book a demo
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

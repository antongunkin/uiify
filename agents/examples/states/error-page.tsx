import { Badge, Button, Heading, Separator, Stack, Text } from "@gunkin/uiify";

const links = [
  ["/docs", "Documentation"],
  ["/pricing", "Pricing"],
  ["/status", "System status"],
];

export default function ErrorPage() {
  return (
    <Stack
      as="main"
      container
      gap="lg"
      align="center"
      justify="center"
      height="screen"
      padding="lg"
    >
      <Stack gap="md" align="center" maxWidth="md">
        <Badge variant="outline">Error 404</Badge>
        <Heading level={1} size={{ base: "3xl", md: "5xl" }} align="center" wrap="balance">
          Page not found
        </Heading>
        <Text tone="muted" align="center" measure="prose">
          The link may be broken, or the page moved. Check the address or start from the home page.
        </Text>
      </Stack>
      <Stack direction="inline" gap="sm" justify="center" wrap>
        <Button href="/" size="lg">
          Go home
        </Button>
        <Button href="/help" variant="outline" size="lg">
          Contact support
        </Button>
      </Stack>
      <Stack gap="sm" align="center" width="full" maxWidth="sm">
        <Separator />
        <Text size="sm" tone="muted">
          Popular pages
        </Text>
        <Stack
          as="nav"
          aria-label="Popular pages"
          direction="inline"
          gap="md"
          justify="center"
          wrap
        >
          {links.map(([href, label]) => (
            <Button key={href} href={href} variant="link" size="sm">
              {label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

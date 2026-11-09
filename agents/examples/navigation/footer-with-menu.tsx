import {
  Button,
  Field,
  FieldLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputGroupAddon,
  Stack,
  Text,
} from "@gunkin/uiify";

const columns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
  { title: "Resources", links: ["Docs", "Guides", "Status"] },
];

export default function FooterWithMenu() {
  return (
    <Stack
      as="footer"
      gap="xl"
      paddingBlock="xl"
      container
      className="mx-auto w-full max-w-5xl px-4"
    >
      <Grid columns={{ base: 1, md: "1:2" }} gap="xl">
        <Stack gap="md">
          <Stack gap="xs">
            <Text size="lg" weight="semibold">
              Acme
            </Text>
            <Text size="sm" tone="muted">
              Plan, build and ship with your whole team.
            </Text>
          </Stack>
          <Stack as="form" action="/subscribe" method="post">
            <Field>
              <FieldLabel htmlFor="footer-email">Product news, once a month</FieldLabel>
              <InputGroup>
                <Input
                  id="footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <InputGroupAddon align="end">
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </Stack>
        </Stack>
        <Stack direction="inline" gap="xl" wrap justify={{ base: "start", md: "end" }}>
          {columns.map((column) => (
            <Stack as="nav" key={column.title} gap="sm" aria-label={column.title}>
              <Heading level={2} size="sm">
                {column.title}
              </Heading>
              {column.links.map((link) => (
                <Text as="a" key={link} href={`/${link.toLowerCase()}`} size="sm" tone="muted">
                  {link}
                </Text>
              ))}
            </Stack>
          ))}
        </Stack>
      </Grid>
      <Stack
        direction={{ base: "block", md: "inline" }}
        justify="between"
        align={{ base: "start", md: "center" }}
        gap="sm"
      >
        <Text size="sm" tone="muted">
          © 2026 Acme, Inc. All rights reserved.
        </Text>
        <Stack as="nav" direction="inline" gap="md" aria-label="Legal">
          <Text as="a" href="/privacy" size="sm" tone="muted">
            Privacy
          </Text>
          <Text as="a" href="/terms" size="sm" tone="muted">
            Terms
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}

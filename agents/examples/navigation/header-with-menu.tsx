import { Badge, Box, Button, Drawer, Header, Stack, Text } from "@gunkin/uiify";

const links = [
  ["Product", "/product"],
  ["Pricing", "/pricing"],
  ["Customers", "/customers"],
  ["Docs", "/docs"],
];

export default function HeaderWithMenu() {
  return (
    <Header placement="sticky">
      <Stack
        direction="inline"
        justify="between"
        align="center"
        gap="md"
        paddingBlock="sm"
        className="mx-auto w-full max-w-5xl px-4"
      >
        <Stack direction="inline" gap="lg" align="center">
          <Stack direction="inline" gap="xs" align="center">
            <Text as="a" href="/" size="lg" weight="semibold">
              Acme
            </Text>
            <Badge variant="secondary" size="sm">
              Beta
            </Badge>
          </Stack>
          <Stack as="nav" direction="inline" gap="xs" aria-label="Main" className="hidden md:flex">
            {links.map(([label, href]) => (
              <Button
                key={href}
                href={href}
                variant="ghost"
                size="sm"
                aria-current={href === "/pricing" ? "page" : undefined}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Stack>
        <Stack direction="inline" gap="sm" align="center">
          <Stack direction="inline" gap="sm" className="hidden md:flex">
            <Button href="/sign-in" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button href="/sign-up" size="sm">
              Get started
            </Button>
          </Stack>
          <Box className="md:hidden">
            <Drawer
              id="site-menu"
              trigger="Menu"
              title="Acme"
              side="right"
              footer={
                <Stack direction="inline" gap="sm">
                  <Button href="/sign-in" variant="outline">
                    Sign in
                  </Button>
                  <Button href="/sign-up">Get started</Button>
                </Stack>
              }
            >
              <Stack as="nav" gap="xs" align="start" aria-label="Mobile">
                {links.map(([label, href]) => (
                  <Button
                    key={href}
                    href={href}
                    variant="ghost"
                    aria-current={href === "/pricing" ? "page" : undefined}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            </Drawer>
          </Box>
        </Stack>
      </Stack>
    </Header>
  );
}

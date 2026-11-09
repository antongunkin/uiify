import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  Heading,
  Stack,
  Text,
} from "@gunkin/uiify";

const plans = [
  { name: "Starter", price: "$0", note: "For one person", perks: ["3 projects", "Community help"] },
  {
    name: "Team",
    price: "$12",
    old: "$16",
    note: "Per seat, billed yearly",
    perks: ["Unlimited projects", "Release notes", "Email support"],
    best: true,
  },
  { name: "Business", price: "$24", note: "Per seat, billed yearly", perks: ["SSO", "Audit log"] },
];

export default function PricingHighlight() {
  return (
    <Stack as="section" gap="xl" align="center" container aria-labelledby="pricing-title">
      <Stack gap="sm" align="center">
        <Badge variant="success">Save 25% this month</Badge>
        <Heading
          id="pricing-title"
          level={1}
          size={{ base: "3xl", md: "5xl" }}
          align="center"
          wrap="balance"
        >
          Pricing that grows with you
        </Heading>
        <Text tone="muted" align="center">
          Start free. Upgrade when your team does.
        </Text>
      </Stack>
      <Grid columns={{ base: 1, md: 3 }} gap="lg" align="stretch" width="full">
        {plans.map((plan) => (
          <Card key={plan.name} variant={plan.best ? "highlight" : "default"}>
            <CardHeader>
              <CardTitle as="h2">{plan.name}</CardTitle>
              <CardDescription>{plan.note}</CardDescription>
              {plan.best ? (
                <CardAction>
                  <Badge>Most popular</Badge>
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <Stack direction="inline" gap="sm" align="baseline">
                  <Text size="4xl" weight="semibold">
                    {plan.price}
                  </Text>
                  {plan.old ? (
                    <Text as="s" tone="muted">
                      {plan.old}
                    </Text>
                  ) : null}
                </Stack>
                <Stack as="ul" gap="xs" padding="none">
                  {plan.perks.map((perk) => (
                    <Text as="li" key={perk} size="sm" tone="muted">
                      ✓ {perk}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
            <CardFooter>
              <Stack width="full">
                <Button
                  href={`/signup?plan=${plan.name.toLowerCase()}`}
                  variant={plan.best ? "default" : "outline"}
                >
                  Choose {plan.name}
                </Button>
              </Stack>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

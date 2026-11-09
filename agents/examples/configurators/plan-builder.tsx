import {
  Badge,
  Box,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Stack,
  Text,
} from "@gunkin/uiify";

const addons = [
  {
    id: "addon-sso",
    label: "Single sign-on",
    note: "SAML and SCIM for your IdP",
    price: "$4 / seat",
  },
  { id: "addon-audit", label: "Audit log", note: "Every change, kept 1 year", price: "$2 / seat" },
  {
    id: "addon-support",
    label: "Priority support",
    note: "Reply within 1 hour",
    price: "$99 / mo",
  },
];

export default function PlanBuilder() {
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="form" action="/plans/custom" method="post">
        <CardHeader>
          <CardTitle as="h2">Build your plan</CardTitle>
          <CardDescription>Team plan, $12 per seat. Change it any time.</CardDescription>
          <CardAction>
            <Badge variant="success">14-day trial</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Field>
              <FieldLabel htmlFor="plan-seats">Seats</FieldLabel>
              <Input
                id="plan-seats"
                name="seats"
                type="number"
                min={1}
                defaultValue="10"
                aria-describedby="plan-seats-hint"
              />
              <FieldDescription id="plan-seats-hint">Only active members count.</FieldDescription>
            </Field>
            <FieldSet>
              <FieldLegend>Add-ons</FieldLegend>
              <Stack gap="sm">
                {addons.map((addon) => (
                  <Field key={addon.id} orientation="horizontal" variant="card">
                    <Checkbox id={addon.id} name="addons" value={addon.id} />
                    <FieldContent>
                      <FieldLabel htmlFor={addon.id}>{addon.label}</FieldLabel>
                      <Text size="sm" tone="muted">
                        {addon.note}
                      </Text>
                    </FieldContent>
                    <Text size="sm" weight="medium">
                      {addon.price}
                    </Text>
                  </Field>
                ))}
              </Stack>
            </FieldSet>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" align="center" width="full">
            <Stack gap="none">
              <Text size="2xl" weight="semibold">
                $120
              </Text>
              <Text size="xs" tone="muted">
                a month for 10 seats, before add-ons
              </Text>
            </Stack>
            <Button type="submit">Start trial</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

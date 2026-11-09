import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Grid,
  Input,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function Checkout() {
  return (
    <Grid
      columns={{ base: 1, md: "2:1" }}
      gap="lg"
      align="start"
      responsive="viewport"
      className="mx-auto w-full max-w-5xl"
    >
      <Card as="form" id="checkout" action="/orders" method="post">
        <CardHeader>
          <CardTitle as="h1">Checkout</CardTitle>
          <CardDescription>Ships from Portland in one business day.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Field>
              <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
              <Input id="checkout-email" name="email" type="email" autoComplete="email" required />
            </Field>
            <FieldSet>
              <FieldLegend>Delivery</FieldLegend>
              <RadioGroup aria-label="Delivery">
                <Field orientation="horizontal">
                  <RadioGroupItem
                    name="delivery"
                    value="standard"
                    id="delivery-standard"
                    defaultChecked
                  />
                  <FieldLabel htmlFor="delivery-standard">Standard · Free · 3–5 days</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem name="delivery" value="express" id="delivery-express" />
                  <FieldLabel htmlFor="delivery-express">Express · $12 · Next day</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor="checkout-card">Card number</FieldLabel>
              <Input
                id="checkout-card"
                name="card"
                inputMode="numeric"
                autoComplete="cc-number"
                required
              />
            </Field>
          </Stack>
        </CardContent>
      </Card>
      <Card variant="highlight" as="aside" aria-label="Order total">
        <CardHeader>
          <CardDescription>2 items · tax included</CardDescription>
          <CardTitle as="h2">
            <Text as="span" size="3xl" weight="semibold">
              $136.08
            </Text>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Stack gap="sm" width="full">
            <Button type="submit" form="checkout" size="lg">
              Place order
            </Button>
            <Text size="xs" tone="muted" align="center">
              Free returns within 30 days.
            </Text>
          </Stack>
        </CardFooter>
      </Card>
    </Grid>
  );
}

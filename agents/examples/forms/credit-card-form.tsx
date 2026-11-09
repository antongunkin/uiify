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
  Field,
  FieldDescription,
  FieldLabel,
  Grid,
  Input,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function CreditCardForm() {
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="form" action="/pay" method="post">
        <CardHeader>
          <CardTitle as="h2">Payment details</CardTitle>
          <CardDescription>Enter your card to complete the order.</CardDescription>
          <CardAction>
            <Badge variant="success">Secure checkout</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            <Field>
              <FieldLabel htmlFor="card-name">Name on card</FieldLabel>
              <Input id="card-name" name="cardName" autoComplete="cc-name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="card-number">Card number</FieldLabel>
              <Input
                id="card-number"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                aria-describedby="card-number-hint"
                required
              />
              <FieldDescription id="card-number-hint">The 16 digits on the front.</FieldDescription>
            </Field>
            <Grid columns={2} gap="md">
              <Field>
                <FieldLabel htmlFor="card-expiry">Expiry</FieldLabel>
                <Input
                  id="card-expiry"
                  name="expiry"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="card-cvc">CVC</FieldLabel>
                <Input
                  id="card-cvc"
                  name="cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  required
                />
              </Field>
            </Grid>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack gap="sm" width="full">
            <Button type="submit">Pay $48.00</Button>
            <Text size="sm" tone="muted" align="center">
              You are charged when the order ships.
            </Text>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

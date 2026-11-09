import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldLabel,
  Grid,
  Heading,
  Input,
  NativeSelect,
  NativeSelectContent,
  NativeSelectOption,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function AddressForm() {
  return (
    <Grid
      columns={{ base: 1, md: "1:2" }}
      gap="lg"
      responsive="viewport"
      className="mx-auto w-full max-w-4xl"
    >
      <Stack gap="xs">
        <Heading level={2} size="lg">
          Shipping address
        </Heading>
        <Text size="sm" tone="muted">
          Where we deliver your orders. You can add more addresses later.
        </Text>
      </Stack>
      <Card as="form" action="/address" method="post">
        <CardContent>
          <Grid columns={{ base: 1, md: 2 }} gap="md" responsive="viewport">
            <Field>
              <FieldLabel htmlFor="address-line">Street address</FieldLabel>
              <Input id="address-line" name="line1" autoComplete="address-line1" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="address-extra">Apartment (optional)</FieldLabel>
              <Input id="address-extra" name="line2" autoComplete="address-line2" />
            </Field>
            <Field>
              <FieldLabel htmlFor="address-city">City</FieldLabel>
              <Input id="address-city" name="city" autoComplete="address-level2" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="address-zip">Postal code</FieldLabel>
              <Input id="address-zip" name="zip" autoComplete="postal-code" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="address-country">Country</FieldLabel>
              <NativeSelect
                id="address-country"
                name="country"
                defaultValue="us"
                autoComplete="country"
              >
                <NativeSelectContent>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                </NativeSelectContent>
              </NativeSelect>
            </Field>
          </Grid>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="end" gap="sm" width="full">
            <Button type="reset" variant="ghost">
              Cancel
            </Button>
            <Button type="submit">Save address</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Grid>
  );
}

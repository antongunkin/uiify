import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldDescription,
  FieldLabel,
  Heading,
  NativeSelect,
  NativeSelectContent,
  NativeSelectOption,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function SelectBasic() {
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="form" action="/billing/period" method="post">
        <CardContent>
          <Stack gap="md">
            <Stack gap="xs">
              <Stack direction="inline" gap="sm" align="center">
                <Heading level={2} size="lg">
                  Billing period
                </Heading>
                <Badge variant="success">Save 20%</Badge>
              </Stack>
              <Text size="sm" tone="muted">
                Team plan · 10 seats. Your next invoice is $120.00 on Dec 1.
              </Text>
            </Stack>
            <Field>
              <FieldLabel htmlFor="billing-plan">Plan</FieldLabel>
              <NativeSelect
                id="billing-plan"
                name="plan"
                defaultValue="monthly"
                aria-describedby="billing-plan-hint"
              >
                <NativeSelectContent>
                  <NativeSelectOption value="monthly">Monthly · $12 per seat</NativeSelectOption>
                  <NativeSelectOption value="annual">Annual · $9.60 per seat</NativeSelectOption>
                </NativeSelectContent>
              </NativeSelect>
              <FieldDescription id="billing-plan-hint">
                Annual is paid once a year.
              </FieldDescription>
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="end" width="full">
            <Button type="submit" size="sm">
              Save
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

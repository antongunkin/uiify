import {
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
  NativeSelect,
  NativeSelectContent,
  NativeSelectOption,
  SegmentedControl,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function SizePicker() {
  return (
    <Box maxWidth="sm" className="mx-auto w-full">
      <Card as="form" action="/cart" method="post">
        <CardHeader>
          <CardDescription>Trail running · Grey</CardDescription>
          <CardTitle as="h2">Ridge trail shoe</CardTitle>
          <CardAction>
            <Text size="lg" weight="semibold">
              $96
            </Text>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Stack gap="sm">
              <Stack direction="inline" justify="between" align="center">
                <Text weight="medium" id="size-label">
                  Size (EU)
                </Text>
                <Button href="/size-guide" variant="link" size="sm">
                  Size guide
                </Button>
              </Stack>
              <SegmentedControl
                id="shoe-size"
                aria-labelledby="size-label"
                defaultValue="42"
                fullWidth
                items={["40", "41", "42", "43", "44"].map((size) => ({
                  value: size,
                  label: size,
                  disabled: size === "44",
                }))}
              />
              <Text size="sm" tone="muted">
                Size 44 is sold out. Runs true to size.
              </Text>
            </Stack>
            <Field>
              <FieldLabel htmlFor="shoe-width">Width</FieldLabel>
              <NativeSelect
                id="shoe-width"
                name="width"
                defaultValue="regular"
                aria-describedby="shoe-width-hint"
              >
                <NativeSelectContent>
                  <NativeSelectOption value="regular">Regular</NativeSelectOption>
                  <NativeSelectOption value="wide">Wide</NativeSelectOption>
                </NativeSelectContent>
              </NativeSelect>
              <FieldDescription id="shoe-width-hint">
                Pick wide if you go up a size in most brands.
              </FieldDescription>
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" gap="sm" width="full">
            <Stack grow={1}>
              <Button type="submit">Add to cart</Button>
            </Stack>
            <Button type="submit" formAction="/wishlist" variant="outline">
              Save
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

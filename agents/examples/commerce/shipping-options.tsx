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
  FieldContent,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Text,
} from "@gunkin/uiify";

const options = [
  { value: "pickup", label: "Store pickup", note: "Ready tomorrow at Market St.", price: "Free" },
  { value: "standard", label: "Standard", note: "Arrives Nov 13–15", price: "$6" },
  {
    value: "express",
    label: "Express",
    note: "Arrives tomorrow by 8 PM",
    price: "$12",
    tag: "Fastest",
  },
];

export default function ShippingOptions() {
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="form" action="/checkout/shipping" method="post">
        <CardHeader>
          <CardTitle as="h2" id="shipping-title">
            Shipping method
          </CardTitle>
          <CardDescription>Delivering to 12 Market St, San Francisco.</CardDescription>
          <CardAction>
            <Button href="/checkout/address" variant="outline" size="sm">
              Change
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <RadioGroup aria-labelledby="shipping-title">
            {options.map((option) => (
              <Field key={option.value} orientation="horizontal" variant="card">
                <RadioGroupItem
                  name="shipping"
                  value={option.value}
                  id={`ship-${option.value}`}
                  defaultChecked={option.value === "standard"}
                />
                <FieldContent>
                  <FieldLabel htmlFor={`ship-${option.value}`}>{option.label}</FieldLabel>
                  <Text size="sm" tone="muted">
                    {option.note}
                  </Text>
                </FieldContent>
                <Stack direction="inline" gap="sm" align="center">
                  {option.tag && <Badge variant="outline">{option.tag}</Badge>}
                  <Text weight="semibold">{option.price}</Text>
                </Stack>
              </Field>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" align="center" width="full">
            <Button href="/cart" variant="ghost">
              Back to cart
            </Button>
            <Button type="submit">Continue to payment</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

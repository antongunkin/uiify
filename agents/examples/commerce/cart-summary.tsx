import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  Separator,
  Stack,
  Text,
} from "@gunkin/uiify";

const lines = [
  { sku: "ridge-42", name: "Ridge trail shoe", detail: "Size 42 · Grey · Qty 1", price: "$96.00" },
  { sku: "sock-m", name: "Merino socks", detail: "Size M · Qty 2", price: "$24.00" },
];

export default function CartSummary() {
  return (
    <Stack as="section" maxWidth="md" aria-labelledby="cart-title" className="mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle as="h2" id="cart-title">
            Your cart
          </CardTitle>
          <CardDescription>2 items, reserved for 30 minutes.</CardDescription>
          <CardAction>
            <Button href="/shop" variant="link" size="sm">
              Keep shopping
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack as="ul" gap="sm" padding="none">
            {lines.map((line) => (
              <Item key={line.sku}>
                <ItemContent>
                  <Text weight="medium">{line.name}</Text>
                  <Text size="sm" tone="muted">
                    {line.detail}
                  </Text>
                </ItemContent>
                <ItemActions>
                  <Text weight="medium">{line.price}</Text>
                  <Stack as="form" action="/cart/remove" method="post">
                    <input type="hidden" name="sku" value={line.sku} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove ${line.name}`}
                    >
                      Remove
                    </Button>
                  </Stack>
                </ItemActions>
              </Item>
            ))}
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack gap="md" width="full">
            <Separator />
            <Stack direction="inline" justify="between" align="baseline">
              <Stack gap="none">
                <Text weight="semibold">Subtotal</Text>
                <Text size="sm" tone="muted">
                  Shipping and tax at checkout
                </Text>
              </Stack>
              <Text size="xl" weight="semibold">
                $120.00
              </Text>
            </Stack>
            <Button href="/checkout" size="lg">
              Go to checkout
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Stack>
  );
}

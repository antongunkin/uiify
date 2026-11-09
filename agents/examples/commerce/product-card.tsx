import {
  AspectRatio,
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
  Stack,
  Text,
} from "@gunkin/uiify";

export default function ProductCard() {
  return (
    <Box maxWidth="sm" className="mx-auto w-full">
      <Card as="article">
        <AspectRatio ratio={4 / 3}>
          <img
            src="/products/trail-shoe.jpg"
            alt="Grey trail running shoe, side view"
            width={400}
            height={300}
          />
        </AspectRatio>
        <CardHeader>
          <CardDescription>Trail running</CardDescription>
          <CardTitle as="h2">Ridge trail shoe</CardTitle>
          <CardAction>
            <Badge variant="success">In stock</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            <Stack direction="inline" gap="sm" align="baseline">
              <Text size="2xl" weight="semibold">
                $96
              </Text>
              <Text as="s" tone="muted">
                $120
              </Text>
              <Badge variant="destructive">−20%</Badge>
            </Stack>
            <Text size="sm" tone="muted">
              Grippy outsole, rock plate and a breathable mesh upper. Rated 4.8 by 312 runners.
            </Text>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack as="form" action="/cart" method="post" gap="sm" width="full">
            <input type="hidden" name="sku" value="ridge-42" />
            <Button type="submit">Add to cart</Button>
            <Text size="xs" tone="muted" align="center">
              Free shipping and 30-day returns.
            </Text>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

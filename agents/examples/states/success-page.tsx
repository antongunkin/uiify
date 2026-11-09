import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Stack,
} from "@gunkin/uiify";

export default function SuccessPage() {
  return (
    <Box as="main" maxWidth="md" className="mx-auto w-full py-12">
      <Card>
        <CardHeader>
          <CardTitle as="h1">Thanks, your order is in</CardTitle>
          <CardDescription>We emailed a receipt to ada@example.com.</CardDescription>
          <Stack direction="inline">
            <Badge variant="success">Paid</Badge>
          </Stack>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>Order</DescriptionTerm>
            <DescriptionDetails>#1042</DescriptionDetails>
            <DescriptionTerm>Arrives</DescriptionTerm>
            <DescriptionDetails>Thu, Nov 12</DescriptionDetails>
            <DescriptionTerm>Ship to</DescriptionTerm>
            <DescriptionDetails>12 Market St, San Francisco</DescriptionDetails>
          </DescriptionList>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" gap="sm">
            <Button href="/orders/1042">Track order</Button>
            <Button href="/" variant="outline">
              Keep shopping
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

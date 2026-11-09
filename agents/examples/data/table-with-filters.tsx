import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Grid,
  Input,
  NativeSelect,
  NativeSelectContent,
  NativeSelectOption,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gunkin/uiify";

const orders = [
  ["1042", "Northwind", "$1,200", "Shipped"],
  ["1041", "Globex", "$640", "Pending"],
  ["1040", "Initech", "$2,180", "Shipped"],
];

export default function TableWithFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Orders</CardTitle>
        <CardDescription>128 orders this month, newest first.</CardDescription>
        <CardAction>
          <Button href="/orders.csv" variant="outline" size="sm">
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <Stack as="form" action="/orders" method="get" gap="sm">
            <Grid columns={{ base: 1, md: 2 }} responsive="viewport" gap="sm">
              <Field>
                <FieldLabel htmlFor="orders-query">Search</FieldLabel>
                <Input id="orders-query" name="q" type="search" />
              </Field>
              <Field>
                <FieldLabel htmlFor="orders-status">Status</FieldLabel>
                <NativeSelect id="orders-status" name="status" defaultValue="">
                  <NativeSelectContent>
                    <NativeSelectOption value="">All</NativeSelectOption>
                    <NativeSelectOption value="pending">Pending</NativeSelectOption>
                    <NativeSelectOption value="shipped">Shipped</NativeSelectOption>
                  </NativeSelectContent>
                </NativeSelect>
              </Field>
            </Grid>
            <Stack direction="inline" justify="end">
              <Button type="submit" variant="secondary">
                Apply
              </Button>
            </Stack>
          </Stack>
          <Table aria-label="Orders">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="end">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(([id, customer, total, status]) => (
                <TableRow key={id}>
                  <TableCell>#{id}</TableCell>
                  <TableCell>{customer}</TableCell>
                  <TableCell>
                    <Badge variant={status === "Shipped" ? "success" : "warning"}>{status}</Badge>
                  </TableCell>
                  <TableCell align="end">{total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
}

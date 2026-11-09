import {
  Badge,
  Box,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TableRowHeader,
  Text,
} from "@gunkin/uiify";

const rows = [
  { label: "Subtotal", value: "$120.00" },
  { label: "Shipping", value: "$6.00", note: "Standard, 3–5 days" },
  { label: "Discount", value: "−$12.00", note: "Code TRAIL10" },
  { label: "Tax", value: "$10.08" },
];

export default function OrderSummary() {
  return (
    <Box maxWidth="sm" className="mx-auto w-full">
      <Card as="aside" aria-labelledby="order-summary-title">
        <CardHeader>
          <CardTitle as="h2" id="order-summary-title">
            Order summary
          </CardTitle>
          <CardDescription>Order #1042 · 3 items</CardDescription>
          <CardAction>
            <Badge variant="success">Saved $12</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table aria-labelledby="order-summary-title" variant="ghost">
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableRowHeader>
                    {row.label}
                    {row.note && (
                      <Text as="span" size="xs" tone="muted">
                        {` · ${row.note}`}
                      </Text>
                    )}
                  </TableRowHeader>
                  <TableCell align="end">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowHeader>Total</TableRowHeader>
                <TableCell align="end">
                  <Text as="span" size="xl" weight="semibold">
                    $124.08
                  </Text>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter>
          <Text size="xs" tone="muted">
            Prices in USD. Tax calculated for San Francisco, CA.
          </Text>
        </CardFooter>
      </Card>
    </Box>
  );
}

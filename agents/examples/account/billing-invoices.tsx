import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@gunkin/uiify";

const invoices = [
  { id: "INV-1042", date: "Nov 1, 2026", amount: "$120.00", status: "Paid" },
  { id: "INV-1031", date: "Oct 1, 2026", amount: "$120.00", status: "Paid" },
  { id: "INV-1020", date: "Sep 1, 2026", amount: "$96.00", status: "Refunded" },
];

export default function BillingInvoices() {
  return (
    <Stack gap="lg" container className="mx-auto w-full max-w-3xl">
      <Stack gap="xs">
        <Heading level={1}>Billing</Heading>
        <Text tone="muted">Manage your plan and download invoices.</Text>
      </Stack>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Team plan</CardTitle>
          <CardDescription>10 seats · $120 a month · renews Dec 1, 2026</CardDescription>
          <CardAction>
            <Button href="/settings/billing/plan" variant="outline" size="sm">
              Change plan
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Invoices</CardTitle>
          <CardDescription>Your last three payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table aria-label="Invoices">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead align="end">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <a href={`/invoices/${invoice.id}.pdf`}>{invoice.id}</a>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell align="end">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "secondary"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

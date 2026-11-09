import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  Text,
} from "@gunkin/uiify";

const stats = [
  { label: "Revenue", value: "$48,200", change: "+12%", up: true, note: "Up from $43,000" },
  { label: "Active users", value: "3,912", change: "+4%", up: true, note: "158 new this month" },
  { label: "Churn", value: "2.1%", change: "+0.3%", up: false, note: "Watch the team plan" },
  { label: "Open tickets", value: "18", change: "−6", up: true, note: "Median reply 2 h" },
];

export default function StatsCards() {
  return (
    <Grid
      as="section"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="md"
      responsive="viewport"
      aria-label="This month"
      className="w-full"
    >
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle as="p">
              <Text as="span" size="3xl" weight="semibold">
                {stat.value}
              </Text>
            </CardTitle>
            <CardAction>
              <Badge variant={stat.up ? "success" : "warning"}>{stat.change}</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <Text size="sm" tone="muted">
              {stat.note}
            </Text>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}

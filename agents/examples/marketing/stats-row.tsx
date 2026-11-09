import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionDetails,
  DescriptionTerm,
  Grid,
  Stack,
  Text,
} from "@gunkin/uiify";

const stats = [
  { term: "Teams", value: "2,000+", note: "In 40 countries" },
  { term: "Uptime", value: "99.99%", note: "Over the last 12 months" },
  { term: "Releases shipped", value: "48k", note: "1,300 last week" },
  { term: "Average setup", value: "6 min", note: "From sign-up to first plan" },
];

export default function StatsRow() {
  return (
    <Card as="section" aria-labelledby="stats-title">
      <CardHeader>
        <CardTitle as="h2" id="stats-title">
          Built for teams that ship
        </CardTitle>
        <CardDescription>The numbers behind every release we help plan.</CardDescription>
        <CardAction>
          <Badge variant="outline">Updated Nov 2026</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Grid as="dl" columns={{ base: 2, lg: 4 }} gap="lg" responsive="viewport">
          {stats.map((stat) => (
            <Stack key={stat.term} gap="xs">
              <DescriptionTerm>{stat.term}</DescriptionTerm>
              <DescriptionDetails>
                <Text as="span" size="4xl" weight="semibold">
                  {stat.value}
                </Text>
              </DescriptionDetails>
              <DescriptionDetails>
                <Text as="span" size="sm" tone="muted">
                  {stat.note}
                </Text>
              </DescriptionDetails>
            </Stack>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

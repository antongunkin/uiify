import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  Heading,
  Progress,
  Stack,
  Text,
} from "@gunkin/uiify";

const meters = [
  { id: "usage-seats", label: "Seats", used: 8, max: 10, unit: "", note: "2 seats left" },
  { id: "usage-storage", label: "Storage", used: 46, max: 50, unit: " GB", note: "Almost full" },
  {
    id: "usage-runs",
    label: "Build minutes",
    used: 1200,
    max: 3000,
    unit: "",
    note: "Resets Dec 1",
  },
];

export default function UsageMeters() {
  return (
    <Stack gap="lg" className="mx-auto w-full max-w-4xl">
      <Stack direction="inline" justify="between" align="end" gap="md" wrap>
        <Stack gap="xs">
          <Heading level={2} size="2xl">
            Usage this month
          </Heading>
          <Text tone="muted">Team plan · Nov 1 to Nov 30, 2026</Text>
        </Stack>
        <Button href="/settings/billing/plan">Upgrade plan</Button>
      </Stack>
      <Grid columns={{ base: 1, md: 3 }} gap="md" responsive="viewport">
        {meters.map((meter) => {
          const full = meter.used / meter.max >= 0.9;
          return (
            <Card key={meter.id} size="sm" variant={full ? "highlight" : "default"}>
              <CardHeader>
                <CardDescription id={meter.id}>{meter.label}</CardDescription>
                <CardTitle as="p">
                  <Text as="span" size="2xl" weight="semibold">
                    {meter.used.toLocaleString("en-US")}
                    {meter.unit}
                  </Text>{" "}
                  <Text as="span" size="sm" tone="muted">
                    of {meter.max.toLocaleString("en-US")}
                    {meter.unit}
                  </Text>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={meter.used} max={meter.max} aria-labelledby={meter.id} />
              </CardContent>
              <CardFooter>
                {full ? (
                  <Badge variant="warning">{meter.note}</Badge>
                ) : (
                  <Text size="sm" tone="muted">
                    {meter.note}
                  </Text>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </Stack>
  );
}

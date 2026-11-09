import {
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Grid,
  Separator,
  Stack,
  Text,
  ToggleGroup,
} from "@gunkin/uiify";

const rows = ["A", "B", "C", "D"];
const taken = new Set(["A2", "B3", "B4", "D1"]);

export default function SeatPicker() {
  return (
    <Box maxWidth="sm" className="mx-auto w-full">
      <Card as="form" action="/tickets/seats" method="post">
        <CardHeader>
          <CardTitle as="h2">Choose your seats</CardTitle>
          <CardDescription>Hall 4 · Fri, Nov 13 · 8:15 PM</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap="md" align="center">
            <Stack gap="xs" width="full">
              <Separator />
              <Text size="xs" tone="muted" align="center">
                Screen
              </Text>
            </Stack>
            <Grid columns={1} gap="sm">
              {rows.map((row) => (
                <Stack key={row} direction="inline" gap="sm" align="center">
                  <Text size="sm" tone="muted" aria-hidden="true">
                    {row}
                  </Text>
                  <ToggleGroup
                    id={`seats-${row}`}
                    type="multiple"
                    size="sm"
                    aria-label={`Row ${row}`}
                    items={[1, 2, 3, 4, 5].map((n) => ({
                      value: `${row}${n}`,
                      label: `${n}`,
                      disabled: taken.has(`${row}${n}`),
                    }))}
                  />
                </Stack>
              ))}
            </Grid>
            <Text size="sm" tone="muted" align="center">
              Faded seats are taken. Pick up to 6.
            </Text>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack gap="sm" width="full">
            <Button type="submit">Hold seats for 10 minutes</Button>
            <Text size="xs" tone="muted" align="center">
              $14 a seat. Pay after you pick snacks.
            </Text>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemMedia,
  ItemMetadata,
  Stack,
  Text,
} from "@gunkin/uiify";

const events = [
  {
    who: "Grace Hopper",
    what: "shipped release 2.4",
    kind: "Release",
    when: "2026-11-08T09:12",
    label: "Today, 09:12",
  },
  {
    who: "Alan Turing",
    what: "merged “Faster search”",
    kind: "Code",
    when: "2026-11-07T17:40",
    label: "Yesterday, 17:40",
  },
  {
    who: "Ada Lovelace",
    what: "opened the Q4 roadmap",
    kind: "Planning",
    when: "2026-11-05T11:03",
    label: "Nov 5, 11:03",
  },
];

export default function ActivityTimeline() {
  return (
    <Box maxWidth="lg" className="mx-auto w-full">
      <Card as="section" aria-labelledby="activity-title">
        <CardHeader>
          <CardTitle as="h2" id="activity-title">
            Activity
          </CardTitle>
          <CardDescription>What changed in Orbit this week, newest first.</CardDescription>
          <CardAction>
            <Button href="/activity" variant="ghost" size="sm">
              View all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack as="ol" gap="none" padding="none">
            {events.map((event) => (
              <Item key={event.when}>
                <ItemMedia>
                  <Avatar name={event.who} fallback={event.who.slice(0, 1)} size="sm" />
                </ItemMedia>
                <ItemContent>
                  <Text>
                    <Text as="span" weight="medium">
                      {event.who}
                    </Text>{" "}
                    {event.what}
                  </Text>
                </ItemContent>
                <ItemMetadata>
                  <Stack direction="inline" gap="sm" align="center">
                    <Badge variant="secondary">{event.kind}</Badge>
                    <time dateTime={event.when}>{event.label}</time>
                  </Stack>
                </ItemMetadata>
              </Item>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

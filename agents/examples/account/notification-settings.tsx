import {
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
  Field,
  FieldDescription,
  FieldLabel,
  Stack,
  Switch,
} from "@gunkin/uiify";

export default function NotificationSettings() {
  return (
    <Box maxWidth="lg" className="mx-auto w-full">
      <Card as="form" action="/settings/notifications" method="post">
        <CardHeader>
          <CardTitle as="h2">Email notifications</CardTitle>
          <CardDescription>Sent to ada@example.com. Security alerts always arrive.</CardDescription>
          <CardAction>
            <Badge variant="secondary">2 of 3 on</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Field orientation="horizontal">
              <Stack gap="xs" grow={1} minWidth="zero">
                <FieldLabel htmlFor="notify-mentions">Mentions</FieldLabel>
                <FieldDescription id="notify-mentions-note">
                  When someone mentions you in a comment.
                </FieldDescription>
              </Stack>
              <Switch
                id="notify-mentions"
                name="mentions"
                defaultChecked
                aria-describedby="notify-mentions-note"
              />
            </Field>
            <Field orientation="horizontal">
              <Stack gap="xs" grow={1} minWidth="zero">
                <FieldLabel htmlFor="notify-releases">Releases</FieldLabel>
                <FieldDescription id="notify-releases-note">
                  When a project you follow ships a release.
                </FieldDescription>
              </Stack>
              <Switch
                id="notify-releases"
                name="releases"
                defaultChecked
                aria-describedby="notify-releases-note"
              />
            </Field>
            <Field orientation="horizontal">
              <Stack gap="xs" grow={1} minWidth="zero">
                <FieldLabel htmlFor="notify-digest">Weekly digest</FieldLabel>
                <FieldDescription id="notify-digest-note">
                  A summary of your workspace every Monday.
                </FieldDescription>
              </Stack>
              <Switch id="notify-digest" name="digest" aria-describedby="notify-digest-note" />
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="end" gap="sm" width="full">
            <Button href="/settings/notifications/unsubscribe" variant="ghost">
              Turn all off
            </Button>
            <Button type="submit">Save preferences</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

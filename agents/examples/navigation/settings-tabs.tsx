import {
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
  Heading,
  Input,
  Stack,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@gunkin/uiify";

export default function SettingsTabs() {
  return (
    <Stack gap="lg" className="mx-auto w-full max-w-2xl">
      <Stack gap="xs">
        <Heading level={1}>Workspace settings</Heading>
        <Text tone="muted">Name, people and alerts for Acme.</Text>
      </Stack>
      <Tabs>
        <TabsList>
          <TabsTrigger name="settings-tab" value="general" defaultChecked>
            General
          </TabsTrigger>
          <TabsTrigger name="settings-tab" value="members">
            Members
          </TabsTrigger>
          <TabsTrigger name="settings-tab" value="alerts">
            Alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card as="form" action="/settings/general" method="post">
            <CardHeader>
              <CardTitle as="h2">General</CardTitle>
              <CardDescription>Shown in invites.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                <Input id="workspace-name" name="name" defaultValue="Acme" />
              </Field>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle as="h2">Members</CardTitle>
              <CardDescription>12 members, 3 pending invites.</CardDescription>
              <CardAction>
                <Button href="/members/invite" variant="outline" size="sm">
                  Invite
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="alerts">
          <Card as="form" action="/settings/alerts" method="post">
            <CardHeader>
              <CardTitle as="h2">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Field orientation="horizontal">
                <Stack gap="xs" grow={1}>
                  <FieldLabel htmlFor="alerts-email">Failed builds</FieldLabel>
                  <FieldDescription id="alerts-email-hint">
                    Email me when one fails.
                  </FieldDescription>
                </Stack>
                <Switch
                  id="alerts-email"
                  name="alertsEmail"
                  defaultChecked
                  aria-describedby="alerts-email-hint"
                />
              </Field>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}

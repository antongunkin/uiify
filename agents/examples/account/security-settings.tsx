import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Heading,
  Input,
  Item,
  ItemActions,
  ItemContent,
  Stack,
  Text,
} from "@gunkin/uiify";

const devices = [
  { name: "MacBook Pro · Chrome", seen: "Lisbon · active now" },
  { name: "iPhone · App", seen: "Porto · 2 days ago", href: "/devices/iphone/sign-out" },
];

export default function SecuritySettings() {
  return (
    <Stack gap="lg" className="mx-auto w-full max-w-2xl">
      <Stack gap="xs">
        <Heading level={1}>Security</Heading>
        <Text tone="muted">Sign-in, password and sessions.</Text>
      </Stack>
      <Alert variant="warning">
        <AlertTitle>Two-step sign-in is off</AlertTitle>
        <AlertDescription>Turn it on in case your password leaks.</AlertDescription>
      </Alert>
      <Card as="form" action="/settings/password" method="post">
        <CardHeader>
          <CardTitle as="h2">Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input
                id="current-password"
                name="current"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                name="next"
                type="password"
                autoComplete="new-password"
                minLength={12}
                aria-describedby="new-password-hint"
                required
              />
              <FieldDescription id="new-password-hint">At least 12 characters.</FieldDescription>
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button type="submit">Update password</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Signed-in devices</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack as="ul" gap="sm" padding="none">
            {devices.map((device) => (
              <Item key={device.name}>
                <ItemContent>
                  <Text weight="medium">{device.name}</Text>
                  <Text size="sm" tone="muted">
                    {device.seen}
                  </Text>
                </ItemContent>
                <ItemActions>
                  {device.href ? (
                    <Button href={device.href} variant="ghost" size="sm">
                      Sign out
                    </Button>
                  ) : (
                    <Badge variant="success">This device</Badge>
                  )}
                </ItemActions>
              </Item>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

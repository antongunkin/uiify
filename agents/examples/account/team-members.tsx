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
  Field,
  FieldLabel,
  Heading,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  Stack,
  Text,
} from "@gunkin/uiify";

const members = [
  { name: "Ada Lovelace", initials: "AL", email: "ada@example.com", role: "Owner" },
  { name: "Grace Hopper", initials: "GH", email: "grace@example.com", role: "Admin" },
  { name: "Alan Turing", initials: "AT", email: "alan@example.com", role: "Member" },
];

export default function TeamMembers() {
  return (
    <Stack gap="lg" className="mx-auto w-full max-w-3xl">
      <Stack gap="xs">
        <Heading level={1}>Team</Heading>
        <Text tone="muted">Invite people and choose what they can change.</Text>
      </Stack>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Members</CardTitle>
          <CardDescription>3 of 10 seats used</CardDescription>
          <CardAction>
            <Badge variant="outline">Team plan</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Stack
              as="form"
              action="/team/invite"
              method="post"
              direction="inline"
              gap="sm"
              align="end"
            >
              <Field>
                <FieldLabel htmlFor="invite-email">Invite by email</FieldLabel>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  placeholder="name@example.com"
                  required
                />
              </Field>
              <Box shrink={0}>
                <Button type="submit">Send invite</Button>
              </Box>
            </Stack>
            <Stack as="ul" gap="sm" padding="none" aria-label="Members">
              {members.map((member) => (
                <Item key={member.email}>
                  <ItemMedia>
                    <Avatar name={member.name} fallback={member.initials} />
                  </ItemMedia>
                  <ItemContent>
                    <Text weight="medium">{member.name}</Text>
                    <Text size="sm" tone="muted">
                      {member.email}
                    </Text>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </ItemActions>
                </Item>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

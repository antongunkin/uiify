import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Grid,
  Input,
  Stack,
  Text,
  Textarea,
} from "@gunkin/uiify";

export default function ProfileSettings() {
  return (
    <Box maxWidth="lg" className="mx-auto w-full" container>
      <Card as="form" action="/settings/profile" method="post">
        <CardHeader>
          <CardTitle as="h2">Profile</CardTitle>
          <CardDescription>This is how others see you in the workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Stack direction="inline" gap="md" align="center">
              <Avatar name="Ada Lovelace" fallback="AL" size="lg" />
              <Stack gap="xs">
                <Button href="/settings/profile/photo" variant="outline" size="sm">
                  Change photo
                </Button>
                <Text size="xs" tone="muted">
                  JPG or PNG, up to 2 MB.
                </Text>
              </Stack>
            </Stack>
            <Grid columns={{ base: 1, md: 2 }} gap="md">
              <Field>
                <FieldLabel htmlFor="profile-first">First name</FieldLabel>
                <Input
                  id="profile-first"
                  name="firstName"
                  autoComplete="given-name"
                  defaultValue="Ada"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-last">Last name</FieldLabel>
                <Input
                  id="profile-last"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue="Lovelace"
                />
              </Field>
            </Grid>
            <Field>
              <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
              <Textarea id="profile-bio" name="bio" rows={3} aria-describedby="profile-bio-hint" />
              <FieldDescription id="profile-bio-hint">
                Shown on your public profile.
              </FieldDescription>
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="end" gap="sm" width="full">
            <Button type="reset" variant="ghost">
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

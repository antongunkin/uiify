import {
  Badge,
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
  Heading,
  Input,
  Progress,
  Stack,
  Text,
} from "@gunkin/uiify";

const steps = [
  { label: "Your account", state: "Done", variant: "success" },
  { label: "Company", state: "Now", variant: "default" },
  { label: "Invite team", state: "Next", variant: "outline" },
] as const;

export default function MultiStepForm() {
  return (
    <Grid
      columns={{ base: 1, md: "1:2" }}
      gap="lg"
      responsive="viewport"
      className="mx-auto w-full max-w-4xl"
    >
      <Stack gap="md">
        <Stack gap="xs">
          <Heading level={1} size="2xl">
            Set up your workspace
          </Heading>
          <Text size="sm" tone="muted">
            Step 2 of 3 · about a minute left
          </Text>
        </Stack>
        <Progress value={2} max={3} aria-label="Onboarding progress" />
        <Stack as="ol" gap="sm" padding="none" aria-label="Steps">
          {steps.map((step) => (
            <Stack as="li" key={step.label} direction="inline" justify="between" align="center">
              <Text size="sm" weight="medium">
                {step.label}
              </Text>
              <Badge variant={step.variant}>{step.state}</Badge>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Card as="form" action="/onboarding/step-3" method="post">
        <CardHeader>
          <CardTitle as="h2">Tell us about your company</CardTitle>
          <CardDescription>We use this to pick templates for your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            <Field>
              <FieldLabel htmlFor="company-name">Company name</FieldLabel>
              <Input id="company-name" name="company" autoComplete="organization" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="company-size">Team size</FieldLabel>
              <Input
                id="company-size"
                name="size"
                type="number"
                min={1}
                defaultValue="12"
                aria-describedby="company-size-hint"
              />
              <FieldDescription id="company-size-hint">You can add seats later.</FieldDescription>
            </Field>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" width="full">
            <Button href="/onboarding/step-1" variant="outline">
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Grid>
  );
}

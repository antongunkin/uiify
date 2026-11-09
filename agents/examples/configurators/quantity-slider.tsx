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
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Field,
  FieldDescription,
  FieldLabel,
  Slider,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function QuantitySlider() {
  return (
    <Box maxWidth="md" className="mx-auto w-full">
      <Card as="form" action="/plans/usage" method="post">
        <CardHeader>
          <CardTitle as="h2">Messages a month</CardTitle>
          <CardDescription>Pay for what you send. Change it any month.</CardDescription>
          <CardAction>
            <Badge variant="success">2 months free yearly</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            <Field>
              <FieldLabel htmlFor="usage-messages">Messages, in thousands</FieldLabel>
              <Slider
                id="usage-messages"
                name="messages"
                min={10}
                max={500}
                step={10}
                defaultValue={100}
                aria-describedby="usage-note"
              />
              <Stack direction="inline" justify="between">
                <Text size="xs" tone="muted">
                  10k
                </Text>
                <Text size="xs" tone="muted">
                  500k
                </Text>
              </Stack>
              <FieldDescription id="usage-note">
                Unused messages roll over to the next month.
              </FieldDescription>
            </Field>
            <DescriptionList>
              <DescriptionTerm>Included</DescriptionTerm>
              <DescriptionDetails>100,000 messages</DescriptionDetails>
              <DescriptionTerm>Per extra 1,000</DescriptionTerm>
              <DescriptionDetails>$0.25</DescriptionDetails>
              <DescriptionTerm>Analytics</DescriptionTerm>
              <DescriptionDetails>Opens, clicks and bounces</DescriptionDetails>
            </DescriptionList>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" align="baseline" width="full">
            <Text size="3xl" weight="semibold">
              $29
              <Text as="span" size="sm" weight="normal" tone="muted">
                {" "}
                a month
              </Text>
            </Text>
            <Button type="submit">Choose usage</Button>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

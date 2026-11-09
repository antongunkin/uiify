import {
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
  Input,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function OtpSignIn() {
  return (
    <Box maxWidth="sm" className="mx-auto w-full">
      <Card as="form" action="/verify" method="post">
        <CardHeader>
          <CardTitle as="h2">Check your email</CardTitle>
          <CardDescription>We sent a 6-digit code to ada@example.com.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="otp-code">Verification code</FieldLabel>
            <Input
              id="otp-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              size="lg"
              aria-describedby="otp-hint"
              required
            />
            <FieldDescription id="otp-hint">The code expires in 10 minutes.</FieldDescription>
          </Field>
        </CardContent>
        <CardFooter>
          <Stack gap="sm" width="full">
            <Button type="submit">Verify and sign in</Button>
            <Stack direction="inline" justify="center" align="center" gap="xs">
              <Text size="sm" tone="muted">
                No code?
              </Text>
              <Button
                type="submit"
                formAction="/verify/resend"
                formNoValidate
                variant="link"
                size="sm"
              >
                Send a new one
              </Button>
            </Stack>
          </Stack>
        </CardFooter>
      </Card>
    </Box>
  );
}

"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@gunkin/uiify";

export default function FieldValidation() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <Stack
      as="form"
      action="/checkout/contact"
      method="post"
      gap="md"
      maxWidth="md"
      className="mx-auto w-full"
    >
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          Checkout · step 1 of 3
        </Text>
        <Heading level={2} size="2xl">
          Contact details
        </Heading>
      </Stack>
      <Card>
        <CardContent>
          <Field invalid={invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              invalid={invalid}
              // A listed id that is not rendered yet is ignored, so one literal covers both states.
              aria-describedby="email-description email-error"
              value={email}
              onValueChange={setEmail}
              required
            />
            <FieldDescription id="email-description">
              We will send your receipt and delivery updates here.
            </FieldDescription>
            {invalid ? (
              <FieldError id="email-error">Enter a valid email address.</FieldError>
            ) : null}
          </Field>
        </CardContent>
        <CardFooter>
          <Stack direction="inline" justify="between" align="center" width="full">
            <Button href="/sign-in" variant="link" size="sm">
              Sign in instead
            </Button>
            <Button type="submit" disabled={invalid}>
              Continue to shipping
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Stack>
  );
}

# Example: field-validation

Element: references/elements/field.md

Export: `FieldValidation`

## Source

```tsx
"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@gunkin/uiify/components/field";
import { Input } from "@gunkin/uiify/components/input";

export function FieldValidation() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <Field invalid={invalid}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        name="email"
        type="email"
        invalid={invalid}
        // A listed id that is not rendered yet is ignored, so one literal covers both states.
        aria-describedby="email-description email-error"
        value={email}
        onValueChange={setEmail}
      />
      <FieldDescription id="email-description">We will send your receipt here.</FieldDescription>
      {invalid ? <FieldError id="email-error">Enter a valid email address.</FieldError> : null}
    </Field>
  );
}
```

## CSS

```css
.uiify-field {
  display: grid;
  gap: 0.5rem;
}

.uiify-field input,
.uiify-native-select {
  min-block-size: 2.75rem;
  padding-inline: 0.75rem;
}

table {
  border-collapse: collapse;
  inline-size: 100%;
}

th,
td {
  padding: 0.5rem;
  text-align: start;
}
```

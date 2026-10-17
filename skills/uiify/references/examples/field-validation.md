# Example: field-validation

Element: references/elements/field.md

Export: `FieldValidation`

## Source

```tsx
"use client";

import { useState } from "react";
import { Field } from "@gunkin/uiify";

export function FieldValidation() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <Field.Root id="email" invalid={invalid}>
      <Field.Label fieldId="email">Email</Field.Label>
      <Field.Control fieldId="email" as="input" type="email" invalid={invalid} value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
      <Field.Description fieldId="email">We will send your receipt here.</Field.Description>
      {invalid ? <Field.Error fieldId="email" invalid>Enter a valid email address.</Field.Error> : null}
    </Field.Root>
  );
}
```

## CSS

```css
[data-uiify-field] { display: grid; gap: 0.5rem; }
[data-uiify-field] input,
[data-uiify-select] { min-block-size: 2.75rem; padding-inline: 0.75rem; }
table { border-collapse: collapse; inline-size: 100%; }
th, td { padding: 0.5rem; text-align: start; }
```

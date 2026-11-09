# Example: alert-confirmation

Element: references/elements/alert-dialog.md

Export: `AlertConfirmation`

## Source

```tsx
"use client";

import { useRef, useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@gunkin/uiify/components/alert-dialog";

export function AlertConfirmation() {
  const [deleted, setDeleted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <section>
      <h2 ref={heading} tabIndex={-1}>
        Draft
      </h2>
      {deleted ? (
        <p role="status">Draft removed from this demo.</p>
      ) : (
        <>
          <AlertDialogTrigger target="delete-draft">Delete draft</AlertDialogTrigger>
          <AlertDialogContent
            id="delete-draft"
            aria-labelledby="delete-draft-title"
            aria-describedby="delete-draft-description"
          >
            <h3 id="delete-draft-title">Delete draft?</h3>
            <p id="delete-draft-description">This removes the draft from this demo.</p>
            <AlertDialogCancel target="delete-draft">Keep draft</AlertDialogCancel>
            <AlertDialogAction
              target="delete-draft"
              onClick={() => {
                setDeleted(true);
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogContent>
        </>
      )}
    </section>
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

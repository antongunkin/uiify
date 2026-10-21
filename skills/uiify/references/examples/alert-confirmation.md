# Example: alert-confirmation

Element: references/elements/alert-modal.md

Export: `AlertConfirmation`

## Source

```tsx
"use client";

import { useRef, useState } from "react";
import { AlertModalAction, AlertModalCancel, AlertModalContent, AlertModalTrigger } from "@gunkin/uiify/components/alert-modal";

export function AlertConfirmation() {
  const [deleted, setDeleted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <section>
      <h2 ref={heading} tabIndex={-1}>Draft</h2>
      {deleted ? <p role="status">Draft removed from this demo.</p> : <>
        <AlertModalTrigger target="delete-draft">Delete draft</AlertModalTrigger>
        <AlertModalContent id="delete-draft" aria-labelledby="delete-draft-title" aria-describedby="delete-draft-description">
          <h3 id="delete-draft-title">Delete draft?</h3>
          <p id="delete-draft-description">This removes the draft from this demo.</p>
          <AlertModalCancel target="delete-draft">Keep draft</AlertModalCancel>
          <AlertModalAction target="delete-draft" onClick={() => {
            setDeleted(true);
            requestAnimationFrame(() => heading.current?.focus());
          }}>Delete</AlertModalAction>
        </AlertModalContent>
      </>}
    </section>
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

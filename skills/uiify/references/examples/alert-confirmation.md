# Example: alert-confirmation

Element: references/elements/alert-modal.md

Export: `AlertConfirmation`

## Source

```tsx
import { AlertModal } from "@gunkin/uiify";

export function AlertConfirmation() {
  return (
    <AlertModal
      id="delete-draft"
      title="Delete draft?"
      description="This permanently removes the draft."
      trigger="Delete draft"
      cancelLabel="Keep draft"
      actionLabel="Delete"
    />
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

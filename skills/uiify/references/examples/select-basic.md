# Example: select-basic

Element: references/elements/select.md

Export: `SelectBasic`

## Source

```tsx
import { Select } from "@gunkin/uiify/components/select";

export function SelectBasic() {
  return (
    <label>
      Plan
      <Select.Root name="plan" defaultValue="monthly">
        <Select.Content>
          <Select.Item value="monthly">Monthly</Select.Item>
          <Select.Item value="annual">Annual</Select.Item>
        </Select.Content>
      </Select.Root>
    </label>
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

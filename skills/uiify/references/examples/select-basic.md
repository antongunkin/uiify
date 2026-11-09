# Example: select-basic

Element: references/elements/native-select.md

Export: `SelectBasic`

## Source

```tsx
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectOption,
} from "@gunkin/uiify/components/native-select";

export function SelectBasic() {
  return (
    <label>
      Plan
      <NativeSelect name="plan" defaultValue="monthly">
        <NativeSelectContent>
          <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
          <NativeSelectOption value="annual">Annual</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>
    </label>
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

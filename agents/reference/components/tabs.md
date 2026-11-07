<!-- Generated from the package source. Do not edit by hand. -->
# tabs

- Import: `@gunkin/uiify/components/tabs`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/tabs.d.ts`
- Note: Compound native radio tabs: TabsList, TabsTrigger and TabsContent; CSS pairs the n-th checked trigger with the n-th content (up to 12).

## Related knowledge

- Recipe: [tabs](../../../skills/uiify/references/elements/tabs.md)

## Exports

- Runtime: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- Types: `TabsContentOwnProps`, `TabsContentProps`, `TabsListOwnProps`, `TabsListProps`, `TabsOrientation`, `TabsOwnProps`, `TabsProps`, `TabsTriggerOwnProps`, `TabsTriggerProps`

## Values

- `TabsOrientation`: `"horizontal" | "vertical"`

## Props and shapes

### TabsOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | One TabsList, then one TabsContent per TabsTrigger, in trigger order. |
| `orientation` | `TabsOrientation` | no | Written as data-orientation. |

### TabsListOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | TabsTrigger parts, as direct children. |

### TabsTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | Same literal name on every trigger of one Tabs; the browser groups the radios by name. |
| `value` | `string` | yes | The radio's value; list TabsContent in the same order as the triggers. |
| `id` | `string` | no | The radio's id, which the label points at. |
| `defaultChecked` | `boolean` | no | Selects this tab initially; set it on one trigger. |
| `disabled` | `boolean` | no | Native `disabled` on the radio, `data-disabled` on the label. |
| `children` | `ReactNode` | no | The visible label. |

### TabsContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes | The value of the matching TabsTrigger; written as data-value. Pairing is by position. |
| `children` | `ReactNode` | no |  |

## Other types

- `TabsProps`: `` TabsOwnProps & // `defaultValue` is omitted: without context a div cannot select a trigger. Omit<ComponentPropsWithRef<"div">, keyof TabsOwnProps | "defaultValue"> `` — A `div` that pairs the i-th checked TabsTrigger with the i-th TabsContent in CSS (up to 12 tabs). It has no `defaultValue`: select initially with `defaultChecked` on one TabsTrigger.
- `TabsListProps`: `TabsListOwnProps & Omit<ComponentPropsWithRef<"div">, keyof TabsListOwnProps>`
- `TabsTriggerProps`: `TabsTriggerOwnProps & Omit<ComponentPropsWithRef<"label">, keyof TabsTriggerOwnProps | "htmlFor">` — A native `input type="radio"` (visually hidden) and its `label`, wrapped in a `display: contents` span. Native props, `className`, `style` and `ref` go to the label.
- `TabsContentProps`: `TabsContentOwnProps & Omit<ComponentPropsWithRef<"div">, keyof TabsContentOwnProps>`

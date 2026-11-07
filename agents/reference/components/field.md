<!-- Generated from the package source. Do not edit by hand. -->
# field

- Import: `@gunkin/uiify/components/field`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div[role=group]`
- Without JavaScript: full
- Types file: `dist/components/field.d.ts`
- Note: Field (role=group, data-orientation; responsive via FieldGroup container query) with FieldLabel/Description/Error/Content/Title/Group/Set/Legend/Separator; errors are server-rendered (no CSS reveal).

## Related knowledge

- Recipe: [field](../../../skills/uiify/references/elements/field.md)
- Example: [field-validation](../../../skills/uiify/references/examples/field-validation.md)

## Exports

- Runtime: `Field`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLabel`, `FieldSeparator`, `FieldTitle`, `FieldLegend`, `FieldSet`
- Types: `FieldContentOwnProps`, `FieldContentProps`, `FieldDescriptionOwnProps`, `FieldDescriptionProps`, `FieldErrorOwnProps`, `FieldErrorProps`, `FieldGroupOwnProps`, `FieldGroupProps`, `FieldLabelOwnProps`, `FieldLabelProps`, `FieldLegendOwnProps`, `FieldLegendProps`, `FieldLegendVariant`, `FieldOrientation`, `FieldOwnProps`, `FieldProps`, `FieldSeparatorOwnProps`, `FieldSeparatorProps`, `FieldSeparatorSlotProps`, `FieldSetOwnProps`, `FieldSetProps`, `FieldTitleOwnProps`, `FieldTitleProps`, `FieldVariant`

## Values

- `FieldOrientation`: `"vertical" | "horizontal" | "responsive"`
- `FieldVariant`: `"card"` — `card`: a bordered selectable container for a radio or checkbox with its FieldContent.
- `FieldLegendVariant`: `"legend" | "label"`

## Props and shapes

### FieldOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `orientation` | `FieldOrientation` | no | Layout of the label, control and content. `responsive` is vertical until the nearest size container (FieldGroup) is at least 28rem wide, then horizontal. Written as data-orientation. |
| `invalid` | `boolean \| undefined` | no | Marks the group with data-invalid. It does not reach the control: set `invalid` on the control and render FieldError with an id listed in its aria-describedby. |
| `variant` | `FieldVariant \| undefined` | no | `card` draws the field as a bordered choice card and stretches its FieldLabel over the card, so a click anywhere selects the control. Written as data-variant; omitted when unset. |

### FieldLabelOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | no |  |
| `required` | `boolean \| undefined` | no |  |

### FieldDescriptionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | no |  |

### FieldErrorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | The message. Without content (`""` and `[]` count as none) FieldError renders nothing. |

### FieldContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Label and description beside a control. |

### FieldTitleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Title text; use `as="span"` inside FieldLabel. |

### FieldGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Fields stacked with form spacing; also the size container for `responsive` fields. |

### FieldSeparatorSlotProps

Props for the generated nodes of FieldSeparator.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `line` | `SlotProps<"hr">` | no | Native props for each generated hr. They apply to both lines, so a `ref` here attaches to both and ends on the last one; use a callback ref to track each line. |
| `content` | `SlotProps<"span">` | no | Native props for the text span. |

### FieldSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Optional inline label such as "or". Shown between the lines and read by assistive tech. |
| `slotProps` | `FieldSeparatorSlotProps` | no | Props for the generated lines and text. |

### FieldSetOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### FieldLegendOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `variant` | `FieldLegendVariant` | no | `legend` sizes it as a section heading; `label` matches FieldLabel. Written as data-variant; omitted when unset, which renders as `legend`. |

## Other types

- `FieldProps`: `FieldOwnProps & Omit<ComponentPropsWithRef<"div">, keyof FieldOwnProps>` — One label, control, description and error. Renders role="group".
- `FieldLabelProps`: `FieldLabelOwnProps & Omit<ComponentPropsWithRef<"label">, keyof FieldLabelOwnProps>` — A native label; its `htmlFor` names the control's `id`.
- `FieldDescriptionProps`: `FieldDescriptionOwnProps & Omit<ComponentPropsWithRef<"p">, keyof FieldDescriptionOwnProps>` — Give it an `id` and list that id in the control's aria-describedby.
- `FieldErrorProps`: `FieldErrorOwnProps & Omit<ComponentPropsWithRef<"p">, keyof FieldErrorOwnProps>` — Give it an `id` and list that id in the control's aria-describedby.
- `FieldContentProps<TAs>`: `RenderableProps<TAs, FieldContentOwnProps, Record<string, never>, HTMLElement>`
- `FieldTitleProps<TAs>`: `RenderableProps<TAs, FieldTitleOwnProps, Record<string, never>, HTMLElement>`
- `FieldGroupProps<TAs>`: `RenderableProps<TAs, FieldGroupOwnProps, Record<string, never>, HTMLElement>`
- `FieldSeparatorProps`: `FieldSeparatorOwnProps & Omit<ComponentPropsWithRef<"div">, keyof FieldSeparatorOwnProps>` — A line with an optional inline label. Without children it is one semantic hr.
- `FieldSetProps<TAs>`: `RenderableProps<TAs, FieldSetOwnProps, Record<string, never>, HTMLFieldSetElement>` — A native fieldset that groups related fields under one legend.
- `FieldLegendProps<TAs>`: `RenderableProps<TAs, FieldLegendOwnProps, Record<string, never>, HTMLLegendElement>` — The native legend that names a FieldSet. Put it first.

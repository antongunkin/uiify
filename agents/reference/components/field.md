<!-- Generated from the package source. Do not edit by hand. -->
# field

- Import: `@gunkin/uiify/components/field`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div:has(input)`
- Without JavaScript: full
- Types file: `dist/components/field.d.ts`
- Note: :user-invalid + :has() reveals the error message

## Related knowledge

- Recipe: [field](../../../skills/uiify/references/elements/field.md)
- Example: [field-validation](../../../skills/uiify/references/examples/field-validation.md)

## Exports

- Runtime: `Field`, `FieldControl`, `FieldDescription`, `FieldError`, `FieldLabel`, `FieldRoot`
- Types: `FieldControlProps`, `FieldDescriptionProps`, `FieldErrorProps`, `FieldLabelProps`, `FieldRootOwnProps`, `FieldRootProps`

## Props and shapes

### FieldRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | Stable id for deterministic label/control/error wiring. Required. |
| `invalid` | `boolean` | no |  |
| `required` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `name` | `string` | no |  |

### FieldPartOwnProps

Every part connects to Field.Root by this one explicit prop — the same `id` passed to Root — instead of props injected via child traversal.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `fieldId` | `string` | yes |  |

### FieldLabelOwnProps

Extends: `FieldPartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `required` | `boolean` | no |  |

### FieldControlOwnProps

Extends: `FieldPartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `invalid` | `boolean` | no |  |
| `required` | `boolean` | no |  |

### FieldDescriptionOwnProps

Extends: `FieldPartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |

### FieldErrorOwnProps

Extends: `FieldPartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `invalid` | `boolean` | no |  |

## Other types

- `FieldRootProps<TAs>`: `RenderableProps<TAs, FieldRootOwnProps, FieldRootOwnProps, HTMLElement>`
- `FieldLabelProps`: `FieldLabelOwnProps & Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor" | keyof FieldLabelOwnProps>`
- `FieldControlProps<TAs>`: `RenderableProps<TAs, FieldControlOwnProps, { disabled: boolean; invalid: boolean; required: boolean }, HTMLElement>`
- `FieldDescriptionProps`: `FieldDescriptionOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof FieldDescriptionOwnProps>`
- `FieldErrorProps`: `FieldErrorOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof FieldErrorOwnProps>`

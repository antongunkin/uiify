<!-- Generated from the package source. Do not edit by hand. -->
# choice

- Import: `@gunkin/uiify/elements/choice`
- Native mechanism: input[type=radio|checkbox] + label
- Parts: `Choice.Group`, `Choice.Item`
- Used by: [radio-group](../components/radio-group.md), [tabs](../components/tabs.md), [toggle-group](../components/toggle-group.md), [segmented-control](../components/segmented-control.md), [rating](../components/rating.md)
- Types file: `dist/elements/choice.d.ts`

## Exports

- Runtime: `Choice`, `ChoiceGroup`, `ChoiceItem`, `choiceGroupName`, `choiceIds`
- Types: `ChoiceGroupOwnProps`, `ChoiceGroupProps`, `ChoiceInputSlotProps`, `ChoiceItemOwnProps`, `ChoiceItemProps`, `ChoiceItemSlotProps`, `ChoiceKind`, `ChoiceLabelSlotProps`, `ChoiceOrientation`, `ChoicePanelSlotProps`

## Values

- `ChoiceKind`: `"single" | "multiple"` — `"single"` renders `type="radio"`; `"multiple"` renders `type="checkbox"`.
- `ChoiceOrientation`: `"horizontal" | "vertical"`

## Props and shapes

### ConsumerDataAttributes

No own members.

### ChoiceGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Seeds every child `Choice.Item`'s derived ids and form-control name — pass the same value to each item's own `groupId`. Tier 0 bans `useContext`, so there is no implicit injection from Group to Item; this id is the explicit wiring, the same pattern `@gunkin/uiify/elements/dialog`'s `target` prop uses. |
| `kind` | `ChoiceKind` | yes |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `name` | `string` | no | Documents the derived `choiceGroupName(id, kind)` override every child `Choice.Item` should also receive as its own `name` — not read by `Choice.Group` itself (there is nowhere to inject it to without context), but declaring it here keeps the two in sync for anyone reading the JSX. |

### ChoiceItemSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `input` | `ChoiceInputSlotProps` | no |  |
| `label` | `ChoiceLabelSlotProps` | no |  |
| `panel` | `ChoicePanelSlotProps` | no |  |

### ChoiceItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `label` | `ReactNode` | yes | Rendered inside the `<label>`. |
| `panel` | `ReactNode` | no | When present, renders `<div data-part="panel">` as a sibling after the label. |
| `groupId` | `string` | yes | The `Choice.Group.id` this item belongs to — see `ChoiceGroupOwnProps.id`. |
| `kind` | `ChoiceKind` | yes |  |
| `name` | `string` | no | Overrides the derived `choiceGroupName(groupId, kind)` form-control name. |
| `defaultChecked` | `boolean` | no | The browser owns the state after first render. |
| `checked` | `boolean` | no | Controlled checked state for client-enhanced choice groups. |
| `disabled` | `boolean` | no |  |
| `part` | `string` | no | Wrapper `data-part`. Defaults to `"item"`. |
| `labelPart` | `boolean \| string` | no | Adds an owned `data-part` marker to the `<label>`; `true` means `"label"`. |
| `slotProps` | `ChoiceItemSlotProps` | no | Native props for the generated input, label and optional panel. |
| `onValueChange` | `(value: string) => void` | no | Client-only: attaches to the input's native `change`. Passing it does not make this element a client component — the *caller* must already be one. Omitted by every uncontrolled (server) caller, so the server output stays handler-free. |

## Other types

- `ChoiceGroupProps`: `ChoiceGroupOwnProps & Omit<ComponentPropsWithRef<"div">, keyof ChoiceGroupOwnProps | "dangerouslySetInnerHTML">`
- `ChoiceInputSlotProps`: `Omit<ComponentPropsWithRef<"input">, | "children" | "dangerouslySetInnerHTML" | "aria-labelledby" | "checked" | "defaultChecked" | "disabled" | "id" | "name" | "type" | "value" | "data-part" | "data-uiify-choice" | "data-uiify-radio"> & ConsumerDataAttributes & { readonly "data-part"?: never; readonly "data-uiify-choice"?: never; readonly "data-uiify-radio"?: never; }`
- `ChoiceLabelSlotProps`: `Omit<ComponentPropsWithRef<"label">, "children" | "dangerouslySetInnerHTML" | "htmlFor" | "id" | "data-part"> & ConsumerDataAttributes & { readonly "data-part"?: never }`
- `ChoicePanelSlotProps`: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML" | "id" | "data-part"> & ConsumerDataAttributes & { readonly "data-part"?: never }`
- `ChoiceItemProps`: `ChoiceItemOwnProps & Omit<ComponentPropsWithRef<"div">, keyof ChoiceItemOwnProps | "children" | "dangerouslySetInnerHTML">`

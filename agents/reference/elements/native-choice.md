<!-- Generated from the package source. Do not edit by hand. -->
# native-choice

- Import: `@gunkin/uiify/elements/native-choice`
- Native mechanism: input[type=radio|checkbox] + label
- Parts: `NativeChoice.Group`, `NativeChoice.Item`
- Used by: [toggle-group](../components/toggle-group.md), [segmented-control](../components/segmented-control.md), [rating](../components/rating.md)
- Types file: `dist/elements/native-choice.d.ts`

## Exports

- Runtime: `NativeChoice`, `NativeChoiceGroup`, `NativeChoiceItem`, `choiceGroupName`, `choiceIds`
- Types: `NativeChoiceGroupOwnProps`, `NativeChoiceGroupProps`, `NativeChoiceInputSlotProps`, `NativeChoiceItemOwnProps`, `NativeChoiceItemProps`, `NativeChoiceItemSlotProps`, `NativeChoiceKind`, `NativeChoiceLabelSlotProps`, `NativeChoiceOrientation`, `NativeChoicePanelSlotProps`

## Values

- `NativeChoiceKind`: `"single" | "multiple"` — `"single"` renders `type="radio"`; `"multiple"` renders `type="checkbox"`.
- `NativeChoiceOrientation`: `"horizontal" | "vertical"`

## Props and shapes

### ConsumerDataAttributes

No own members.

### NativeChoiceGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Seeds every child `NativeChoice.Item`'s derived ids and form-control name — pass the same value to each item's own `groupId`. Tier 0 bans `useContext`, so there is no implicit injection from Group to Item; this id is the explicit wiring, the same pattern `@gunkin/uiify/elements/dialog`'s `target` prop uses. |
| `kind` | `NativeChoiceKind` | yes |  |
| `orientation` | `NativeChoiceOrientation` | no |  |
| `name` | `string` | no | Documents the derived `choiceGroupName(id, kind)` override every child `NativeChoice.Item` should also receive as its own `name` — not read by `NativeChoice.Group` itself (there is nowhere to inject it to without context), but declaring it here keeps the two in sync for anyone reading the JSX. |

### NativeChoiceItemSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `input` | `NativeChoiceInputSlotProps` | no |  |
| `label` | `NativeChoiceLabelSlotProps` | no |  |
| `panel` | `NativeChoicePanelSlotProps` | no |  |

### NativeChoiceItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `label` | `ReactNode` | yes | Rendered inside the `<label>`. |
| `panel` | `ReactNode` | no | When present, renders `<div class="uiify-native-choice-panel">` as a sibling after the label. |
| `groupId` | `string` | yes | The `NativeChoice.Group.id` this item belongs to — see `NativeChoiceGroupOwnProps.id`. |
| `kind` | `NativeChoiceKind` | yes |  |
| `name` | `string` | no | Overrides the derived `choiceGroupName(groupId, kind)` form-control name. |
| `defaultChecked` | `boolean` | no | The browser owns the state after first render. |
| `checked` | `boolean` | no | Controlled checked state for client-enhanced choice groups. |
| `disabled` | `boolean` | no |  |
| `slotProps` | `NativeChoiceItemSlotProps` | no | Native props for the generated input, label and optional panel. |
| `onValueChange` | `(value: string) => void` | no | Client-only: attaches to the input's native `change`. Passing it does not make this element a client component — the *caller* must already be one. Omitted by every uncontrolled (server) caller, so the server output stays handler-free. |

## Other types

- `NativeChoiceGroupProps`: `NativeChoiceGroupOwnProps & Omit<ComponentPropsWithRef<"div">, keyof NativeChoiceGroupOwnProps | "dangerouslySetInnerHTML">`
- `NativeChoiceInputSlotProps`: `Omit<ComponentPropsWithRef<"input">, "children" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes` — Native props of the generated input; consumer values replace the defaults.
- `NativeChoiceLabelSlotProps`: `Omit<ComponentPropsWithRef<"label">, "children" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes`
- `NativeChoicePanelSlotProps`: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes`
- `NativeChoiceItemProps`: `NativeChoiceItemOwnProps & Omit<ComponentPropsWithRef<"div">, keyof NativeChoiceItemOwnProps | "children" | "dangerouslySetInnerHTML">`

<!-- Generated from the package source. Do not edit by hand. -->
# radio-group

- Import: `@gunkin/uiify/components/radio-group`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/radio-group.d.ts`
- Note: Compound RadioGroup (div role=radiogroup) + RadioGroupItem (bare native radio); browser owns selection by shared name.

## Related knowledge

- Recipe: [radio-group](../../../skills/uiify/references/elements/radio-group.md)

## Exports

- Runtime: `RadioGroup`, `RadioGroupItem`
- Types: `RadioGroupItemOwnProps`, `RadioGroupItemProps`, `RadioGroupOrientation`, `RadioGroupOwnProps`, `RadioGroupProps`

## Values

- `RadioGroupOrientation`: `"horizontal" | "vertical"`

## Props and shapes

### RadioGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | RadioGroupItem controls, each with its label (usually one Field per option). |
| `orientation` | `RadioGroupOrientation` | no | Written as data-orientation. |

### RadioGroupItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | Same literal name on every item of one group; the browser groups radios by name. |
| `value` | `string` | yes | Submitted as `name=value` when this radio is checked. |

## Other types

- `RadioGroupProps`: `` RadioGroupOwnProps & // `defaultValue` is omitted: on a div it does nothing; select with `defaultChecked` on an item. Omit<ComponentPropsWithRef<"div">, keyof RadioGroupOwnProps | "defaultValue"> `` — A `div role="radiogroup"`. Name it with `aria-label`/`aria-labelledby`, or leave it unnamed inside a FieldSet whose FieldLegend names the group. It has no `name`, `defaultValue`, `disabled` or `required`: those are native props of each RadioGroupItem.
- `RadioGroupItemProps`: `RadioGroupItemOwnProps & Omit<ComponentPropsWithRef<"input">, keyof RadioGroupItemOwnProps | "type" | "children" | "dangerouslySetInnerHTML">` — A native `input type="radio"`. Label it with `FieldLabel htmlFor` (its `id`); select it initially with `defaultChecked`. `disabled`, `required` and `form` are native props.

<!-- Generated from the package source. Do not edit by hand. -->
# input-group

- Import: `@gunkin/uiify/components/input-group`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div + native controls`
- Without JavaScript: full
- Types file: `dist/components/input-group.d.ts`
- Note: Static form component; keeps independently labeled native input and action.

## Related knowledge

- Recipe: [input-group](../../../skills/uiify/references/elements/input-group.md)

## Exports

- Runtime: `InputGroup`, `InputGroupAddon`
- Types: `InputGroupAddonOwnProps`, `InputGroupAddonProps`, `InputGroupRootOwnProps`, `InputGroupRootProps`

## Props and shapes

### InputGroupRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### InputGroupAddonOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `"start" \| "end"` | yes |  |
| `children` | `ReactNode` | no |  |

## Other types

- `InputGroupRootProps<TAs>`: `RenderableProps<TAs, InputGroupRootOwnProps, Record<string, never>, HTMLDivElement>`
- `InputGroupAddonProps<TAs>`: `RenderableProps<TAs, InputGroupAddonOwnProps, Record<string, never>, HTMLSpanElement>`

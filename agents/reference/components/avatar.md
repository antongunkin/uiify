<!-- Generated from the package source. Do not edit by hand. -->
# avatar

- Import: `@gunkin/uiify/components/avatar`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `span`
- Without JavaScript: full
- Types file: `dist/components/avatar.d.ts`

## Related knowledge

- Recipe: [avatar](../../../skills/uiify/references/elements/avatar.md)

## Exports

- Runtime: `Avatar`
- Types: `AvatarOwnProps`, `AvatarProps`, `AvatarSize`

## Values

- `AvatarSize`: `"sm" | "md" | "lg"`

## Props and shapes

### AvatarOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes |  |
| `fallback` | `string` | yes |  |
| `src` | `string` | no |  |
| `size` | `AvatarSize` | no |  |
| `children` | `never` | no |  |
| `slotProps` | `AvatarSlotProps` | no |  |

### AvatarSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `image` | `AvatarImageSlotProps` | no |  |
| `fallback` | `AvatarFallbackSlotProps` | no |  |

## Other types

- `AvatarProps<TAs>`: `RenderableProps<TAs, AvatarOwnProps, Record<string, never>, HTMLElement>`
- `AvatarImageSlotProps`: `SlotProps<"img">`
- `AvatarFallbackSlotProps`: `SlotProps<"span">`

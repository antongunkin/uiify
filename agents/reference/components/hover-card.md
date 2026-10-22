<!-- Generated from the package source. Do not edit by hand. -->
# hover-card

- Import: `@gunkin/uiify/components/hover-card`
- Tier 1 (RSC shell + thin client island); state source S1; native element `[popover]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/hover-card.d.ts`

## Related knowledge

- Recipe: [hover-card](../../../skills/uiify/references/elements/hover-card.md)

## Exports

- Runtime: `HoverCard`
- Types: `HoverCardContentOwnProps`, `HoverCardContentProps`, `HoverCardRootOwnProps`, `HoverCardRootProps`, `HoverCardTriggerOwnProps`, `HoverCardTriggerProps`

## Props and shapes

### HoverCardRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `closeDelay` | `number` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `id` | `string` | no |  |
| `onOpenChange` | `PopoverChangeHandler` | no |  |
| `open` | `boolean` | no |  |
| `openDelay` | `number` | no |  |

### HoverCardRootProps

Extends: `HoverCardRootOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### HoverCardTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### HoverCardContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `HoverCardTriggerProps<TAs>`: `RenderableProps<TAs, HoverCardTriggerOwnProps, { open: boolean; positioning: "native" }, HTMLElement>`
- `HoverCardContentProps<TAs>`: `RenderableProps<TAs, HoverCardContentOwnProps, { open: boolean; positioning: "native" }, HTMLElement>`

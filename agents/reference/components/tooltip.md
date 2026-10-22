<!-- Generated from the package source. Do not edit by hand. -->
# tooltip

- Import: `@gunkin/uiify/components/tooltip`
- Tier 1 (RSC shell + thin client island); state source S1; native element `[popover]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/tooltip.d.ts`

## Related knowledge

- Recipe: [tooltip](../../../skills/uiify/references/elements/tooltip.md)

## Exports

- Runtime: `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`
- Types: `TooltipContentOwnProps`, `TooltipContentProps`, `TooltipProviderOwnProps`, `TooltipRootOwnProps`, `TooltipRootProps`, `TooltipTriggerOwnProps`, `TooltipTriggerProps`

## Props and shapes

### TooltipProviderOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `delayDuration` | `number` | yes |  |
| `skipDelayDuration` | `number` | yes |  |

### TooltipProviderStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getDelayDuration` | `() => number` | yes |  |
| `markOpened` | `() => void` | yes |  |
| `shouldSkipDelay` | `() => boolean` | yes |  |
| `updateOptions` | `(next: TooltipProviderOptions) => void` | yes |  |

### TooltipProviderOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `delayDuration` | `number` | no |  |
| `skipDelayDuration` | `number` | no |  |

### TooltipRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | no |  |
| `id` | `string` | no |  |
| `onOpenChange` | `PopoverChangeHandler` | no |  |
| `open` | `boolean` | no |  |

### TooltipRootProps

Extends: `TooltipRootOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TooltipTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### TooltipContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `TooltipTriggerProps<TAs>`: `RenderableProps<TAs, TooltipTriggerOwnProps, { open: boolean }, HTMLElement>`
- `TooltipContentProps<TAs>`: `RenderableProps<TAs, TooltipContentOwnProps, { open: boolean; positioning: "native" }, HTMLElement>`

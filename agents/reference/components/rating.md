<!-- Generated from the package source. Do not edit by hand. -->
# rating

- Import: `@gunkin/uiify/components/rating`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/rating.d.ts`
- Note: Native radio group; hover preview and persisted selection are pure CSS (:checked/:hover sibling rules), no JS. Controlled value/onValueChange lives in the separate rating/client entry. Built on @gunkin/uiify/elements/choice.

## Exports

- Runtime: `Rating`
- Types: `RatingProps`

## Props and shapes

### RatingProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `defaultValue` | `number` | no |  |
| `max` | `number` | no |  |
| `readOnly` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `className` | `string` | no |  |
| `"aria-label"` | `string` | no |  |

### RatingClientProps

Extends: `RatingProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `number` | no |  |
| `onValueChange` | `(value: number) => void` | no |  |

## Sub-entries

### `@gunkin/uiify/components/rating/client`

- Runtime: `RatingClient`
- Types: `RatingClientProps`

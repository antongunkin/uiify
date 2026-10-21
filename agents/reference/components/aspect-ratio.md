<!-- Generated from the package source. Do not edit by hand. -->
# aspect-ratio

- Import: `@gunkin/uiify/components/aspect-ratio`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/aspect-ratio.d.ts`
- Note: Static layout component; native CSS aspect-ratio isolates child intrinsic sizing.

## Exports

- Runtime: `AspectRatio`
- Types: `AspectRatioOwnProps`, `AspectRatioProps`

## Props and shapes

### AspectRatioOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ratio` | `number` | no | Positive finite width / height ratio. Omit to use the CSS default (square). |
| `children` | `ReactNode` | no |  |

## Other types

- `AspectRatioProps<TAs>`: `RenderableProps<TAs, AspectRatioOwnProps, Record<string, never>, HTMLElement>`

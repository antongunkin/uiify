<!-- Generated from the package source. Do not edit by hand. -->
# typography

- Import: `@gunkin/uiify/components/typography`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `p/h1-h6`
- Without JavaScript: full
- Types file: `dist/components/typography.d.ts`
- Note: Stateless Text and Heading; semantic tag independent of token-based optional appearance.
- Status: pending

## Related knowledge

- Recipe: [typography](../../../skills/uiify/references/elements/typography.md)

## Exports

- Runtime: `Text`, `Heading`
- Types: `* from "./types.js"`

## Props and shapes

### TextOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `size` | `TextSize \| Responsive<TextSize>` | no |  |
| `weight` | `TextWeight \| Responsive<TextWeight>` | no |  |
| `tone` | `TextTone \| Responsive<TextTone>` | no |  |
| `leading` | `TextLeading \| Responsive<TextLeading>` | no |  |
| `align` | `TextAlign \| Responsive<TextAlign>` | no |  |
| `measure` | `TextMeasure \| Responsive<TextMeasure>` | no |  |
| `wrap` | `TextWrap \| Responsive<TextWrap>` | no |  |
| `responsive` | `ResponsiveBasis` | no |  |

### HeadingOwnProps

Extends: `TextOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `level` | `HeadingLevel` | no |  |

## Other types

- `TextProps<TAs>`: `RenderableProps<TAs, TextOwnProps, Record<string, never>, HTMLElement>`
- `HeadingProps<TAs>`: `RenderableProps<TAs, HeadingOwnProps, Record<string, never>, HTMLElement>`

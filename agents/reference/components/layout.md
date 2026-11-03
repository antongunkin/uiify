<!-- Generated from the package source. Do not edit by hand. -->
# layout

- Import: `@gunkin/uiify/components/layout`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div/section`
- Without JavaScript: full
- Types file: `dist/components/layout.d.ts`
- Note: Stateless public Box, Section, Stack, Grid and GridItem. Static layout stylesheet owns geometry; no client entry.
- Status: pending

## Related knowledge

- Recipe: [layout](../../../skills/uiify/references/elements/layout.md)

## Exports

- Runtime: `Box`, `Section`, `Stack`, `Grid`, `GridItem`
- Types: `* from "./types.js"`

## Props and shapes

### CommonGeometryProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `padding` | `Space \| Responsive<Space>` | no |  |
| `paddingInline` | `Space \| Responsive<Space>` | no |  |
| `paddingBlock` | `Space \| Responsive<Space>` | no |  |
| `width` | `LayoutWidth \| Responsive<LayoutWidth>` | no |  |
| `height` | `LayoutHeight \| Responsive<LayoutHeight>` | no |  |
| `minWidth` | `LayoutMinWidth \| Responsive<LayoutMinWidth>` | no |  |
| `maxWidth` | `LayoutMaxWidth \| Responsive<LayoutMaxWidth>` | no |  |
| `grow` | `LayoutFlex \| Responsive<LayoutFlex>` | no |  |
| `shrink` | `LayoutFlex \| Responsive<LayoutFlex>` | no |  |
| `overflow` | `LayoutOverflow \| Responsive<LayoutOverflow>` | no |  |
| `container` | `boolean` | no |  |
| `responsive` | `ResponsiveBasis` | no |  |

### BoxOwnProps

Extends: `CommonGeometryProps`

No own members.

### SectionOwnProps

Extends: `CommonGeometryProps`

No own members.

### StackOwnProps

Extends: `CommonGeometryProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `direction` | `StackDirection \| Responsive<StackDirection>` | no |  |
| `gap` | `Space \| Responsive<Space>` | no |  |
| `align` | `LayoutAlign \| Responsive<LayoutAlign>` | no |  |
| `justify` | `LayoutJustify \| Responsive<LayoutJustify>` | no |  |
| `wrap` | `boolean \| Responsive<boolean>` | no |  |

### GridOwnProps

Extends: `CommonGeometryProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `columns` | `GridColumns \| Responsive<GridColumns>` | no |  |
| `gap` | `Space \| Responsive<Space>` | no |  |
| `rowGap` | `Space \| Responsive<Space>` | no |  |
| `align` | `LayoutAlign \| Responsive<LayoutAlign>` | no |  |
| `justify` | `LayoutJustify \| Responsive<LayoutJustify>` | no |  |

### GridItemOwnProps

Extends: `CommonGeometryProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `columnSpan` | `GridColumnSpan \| Responsive<GridColumnSpan>` | no |  |
| `rowSpan` | `GridTrack \| Responsive<GridTrack>` | no |  |
| `columnStart` | `GridColumnStart \| Responsive<GridColumnStart>` | no |  |
| `alignSelf` | `GridAlignSelf \| Responsive<GridAlignSelf>` | no |  |

## Other types

- `BoxProps<TAs>`: `RenderableProps<TAs, BoxOwnProps, Record<string, never>, HTMLElement>`
- `SectionProps<TAs>`: `RenderableProps<TAs, SectionOwnProps, Record<string, never>, HTMLElement>`
- `StackProps<TAs>`: `RenderableProps<TAs, StackOwnProps, Record<string, never>, HTMLElement>`
- `GridProps<TAs>`: `RenderableProps<TAs, GridOwnProps, Record<string, never>, HTMLElement>`
- `GridItemProps<TAs>`: `RenderableProps<TAs, GridItemOwnProps, Record<string, never>, HTMLElement>`

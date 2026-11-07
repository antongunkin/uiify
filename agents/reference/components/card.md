<!-- Generated from the package source. Do not edit by hand. -->
# card

- Import: `@gunkin/uiify/components/card`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/card.d.ts`
- Note: Static markup: CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter are polymorphic div parts; size="sm" is data-size, and the CardAction column is plain CSS grid.

## Related knowledge

- Recipe: [card](../../../skills/uiify/references/elements/card.md)

## Exports

- Runtime: `Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`
- Types: `CardActionOwnProps`, `CardActionProps`, `CardContentOwnProps`, `CardContentProps`, `CardDescriptionOwnProps`, `CardDescriptionProps`, `CardFooterOwnProps`, `CardFooterProps`, `CardHeaderOwnProps`, `CardHeaderProps`, `CardOwnProps`, `CardProps`, `CardSize`, `CardTitleOwnProps`, `CardTitleProps`

## Values

- `CardSize`: `"default" | "sm"` — `default` is the unset look; `sm` tightens the padding, gaps and title.

## Props and shapes

### CardOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `size` | `CardSize` | no | `sm` tightens the padding, gaps and title. Written as data-size; `default` renders none, the same as unset. |

### CardHeaderOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | CardTitle, CardDescription and an optional CardAction. |

### CardTitleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Title text; use `as="h2"` or `as="h3"` for a heading. |

### CardDescriptionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Supporting text under the title. |

### CardActionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | A badge or small button beside the title, at the header's inline end. |

### CardContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | The card's main content. |

### CardFooterOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | A row of buttons or links; wraps when it does not fit. |

## Other types

- `CardProps<TAs>`: `RenderableProps<TAs, CardOwnProps, Record<string, never>, HTMLElement>`
- `CardHeaderProps<TAs>`: `RenderableProps<TAs, CardHeaderOwnProps, Record<string, never>, HTMLElement>` — The top row: title and description, with a CardAction placed at the inline end.
- `CardTitleProps<TAs>`: `RenderableProps<TAs, CardTitleOwnProps, Record<string, never>, HTMLElement>`
- `CardDescriptionProps<TAs>`: `RenderableProps<TAs, CardDescriptionOwnProps, Record<string, never>, HTMLElement>`
- `CardActionProps<TAs>`: `RenderableProps<TAs, CardActionOwnProps, Record<string, never>, HTMLElement>`
- `CardContentProps<TAs>`: `RenderableProps<TAs, CardContentOwnProps, Record<string, never>, HTMLElement>`
- `CardFooterProps<TAs>`: `RenderableProps<TAs, CardFooterOwnProps, Record<string, never>, HTMLElement>`

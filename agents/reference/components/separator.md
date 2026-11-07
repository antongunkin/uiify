<!-- Generated from the package source. Do not edit by hand. -->
# separator

- Import: `@gunkin/uiify/components/separator`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `hr`
- Without JavaScript: full
- Types file: `dist/components/separator.d.ts`
- Note: Native hr; FieldSeparator (components/field) adds a labelled divider with two decorative hr lines around a text span.

## Related knowledge

- Recipe: [separator](../../../skills/uiify/references/elements/separator.md)

## Exports

- Runtime: `Separator`
- Types: `SeparatorOrientation`, `SeparatorOwnProps`, `SeparatorProps`

## Values

- `SeparatorOrientation`: `"horizontal" | "vertical"`

## Props and shapes

### SeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `orientation` | `SeparatorOrientation` | no | Direction of the line. Vertical also writes aria-orientation="vertical". |

## Other types

- `SeparatorProps`: `SeparatorOwnProps & Omit<ComponentPropsWithRef<"hr">, keyof SeparatorOwnProps>` — A native hr: a thematic break exposed as a separator. For a purely decorative line pass role="presentation" (and aria-orientation={undefined} when vertical).

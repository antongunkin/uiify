<!-- Generated from the package source. Do not edit by hand. -->
# aspect-ratio

- Import: `@gunkin/uiify/components/aspect-ratio`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/aspect-ratio.d.ts`
- Note: Static layout component; native CSS aspect-ratio isolates child intrinsic sizing.

## Related knowledge

- Recipe: [aspect-ratio](../../../skills/uiify/references/elements/aspect-ratio.md)

## Exports

- Runtime: `AspectRatio`
- Types: `AspectRatioOwnProps`, `AspectRatioProps`

## Props and shapes

### AspectRatioOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ratio` | `number` | no | Positive finite width / height ratio. Omit to use the CSS default (square). |
| `children` | `ReactNode` | no |  |
| `slotProps` | `AspectRatioSlotProps` | no |  |

### AspectRatioSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `AspectRatioContentSlotProps` | no |  |

## Other types

- `AspectRatioProps<TAs>`: `RenderableProps<TAs, AspectRatioOwnProps, Record<string, never>, HTMLElement>`
- `AspectRatioContentSlotProps`: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-aspect-ratio"> & { readonly "data-part"?: never; readonly "data-uiify-aspect-ratio"?: never; } & ConsumerDataAttributes`

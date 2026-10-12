<!-- Generated from the package source. Do not edit by hand. -->
# header

- Import: `@gunkin/uiify/components/header`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `header`
- Without JavaScript: full
- Types file: `dist/components/header.d.ts`
- Note: Semantic header root; compose native navigation with Modal. Full functionality without JavaScript; optional header/client adds scroll hide/reveal.

## Exports

- Runtime: `Header`, `HeaderRoot`
- Types: `HeaderClientProps`, `HeaderClientState`, `HeaderPlacement`, `HeaderRootProps`

## Values

- `HeaderPlacement`: `"static" | "sticky"`
- `HeaderClientState`: `"top" | "visible" | "hidden"`

## Props and shapes

### HeaderRootProps

Extends: `ComponentPropsWithRef<"header">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `placement` | `HeaderPlacement` | no |  |

### HeaderClientProps

Extends: `HeaderRootProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `hideOnScroll` | `boolean` | no |  |
| `scrollTarget` | `string` | no |  |

## Sub-entries

### `@gunkin/uiify/components/header/client`

- Runtime: `HeaderClient`
- Types: `HeaderClientProps`, `HeaderClientState`

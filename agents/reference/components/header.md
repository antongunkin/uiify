<!-- Generated from the package source. Do not edit by hand. -->
# header

- Import: `@gunkin/uiify/components/header`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `header`
- Without JavaScript: full
- Types file: `dist/components/header.d.ts`
- Note: Semantic header root; compose native navigation with Dialog. Full functionality without JavaScript; optional header/client adds scroll hide/reveal.

## Related knowledge

- Recipe: [header](../../../skills/uiify/references/elements/header.md)

## Exports

- Runtime: `Header`
- Types: `HeaderClientProps`, `HeaderClientState`, `HeaderPlacement`, `HeaderProps`, `HeaderTone`

## Values

- `HeaderPlacement`: `"static" | "sticky"`
- `HeaderTone`: `"default" | "primary"` — `default` is the unset look; `primary` fills the bar with the brand colour.
- `HeaderClientState`: `"top" | "visible" | "hidden"`

## Props and shapes

### HeaderProps

Extends: `ComponentPropsWithRef<"header">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `placement` | `HeaderPlacement` | no |  |
| `tone` | `HeaderTone` | no | `primary` fills the header with `--primary` and sets its text to `--primary-foreground`; `Text` without `tone` inherits it. Written as data-tone; `default` renders none. |

### HeaderClientProps

Extends: `HeaderProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `hideOnScroll` | `boolean` | no |  |
| `scrollTarget` | `string` | no |  |

## Sub-entries

### `@gunkin/uiify/components/header/client`

- Runtime: `HeaderClient`
- Types: `HeaderClientProps`, `HeaderClientState`

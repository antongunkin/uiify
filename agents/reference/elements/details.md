<!-- Generated from the package source. Do not edit by hand. -->
# details

- Import: `@gunkin/uiify/elements/details`
- Native mechanism: details/summary
- Parts: `Details.Root`, `Details.Summary`, `Details.Content`
- Used by: [accordion](../components/accordion.md), [collapsible](../components/collapsible.md), [breadcrumb](../components/breadcrumb.md)
- Types file: `dist/elements/details.d.ts`

## Exports

- Runtime: `Details`, `DetailsContent`, `DetailsRoot`, `DetailsSummary`
- Types: `DetailsContentOwnProps`, `DetailsContentProps`, `DetailsRootOwnProps`, `DetailsRootProps`, `DetailsSummaryOwnProps`, `DetailsSummaryProps`

## Props and shapes

### DetailsRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no | Applies the native `open` attribute on first render. |
| `name` | `string` | no | Groups sibling `<details name>` into an exclusive, single-open set — the browser enforces it, no JS. Must be unique per group and stable across SSR. |
| `disabled` | `boolean` | no |  |

### DetailsSummaryOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `part` | `string` | no | `data-part` value on the rendered `<summary>`; omitted entirely when not given. |

### DetailsContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `part` | `string` | no | `data-part` value on the rendered element; omitted entirely when not given. |

## Other types

- `DetailsRootProps`: `DetailsRootOwnProps & Omit<ComponentPropsWithRef<"details">, keyof DetailsRootOwnProps | "open">` — `open` is not part of the contract — use `defaultOpen`; the browser owns state after that.
- `DetailsSummaryProps`: `DetailsSummaryOwnProps & Omit<ComponentPropsWithRef<"summary">, keyof DetailsSummaryOwnProps>`
- `DetailsContentProps<TAs>`: `RenderableProps<TAs, DetailsContentOwnProps, Record<string, never>, HTMLElement>`

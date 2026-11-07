<!-- Generated from the package source. Do not edit by hand. -->
# native-details

- Import: `@gunkin/uiify/elements/native-details`
- Native mechanism: details/summary
- Parts: `NativeDetails.Root`, `NativeDetails.Summary`, `NativeDetails.Content`
- Used by: [accordion](../components/accordion.md), [collapsible](../components/collapsible.md), [breadcrumb](../components/breadcrumb.md)
- Types file: `dist/elements/native-details.d.ts`

## Exports

- Runtime: `NativeDetails`, `NativeDetailsContent`, `NativeDetailsRoot`, `NativeDetailsSummary`
- Types: `NativeDetailsContentOwnProps`, `NativeDetailsContentProps`, `NativeDetailsRootOwnProps`, `NativeDetailsRootProps`, `NativeDetailsSummaryOwnProps`, `NativeDetailsSummaryProps`

## Props and shapes

### NativeDetailsRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no | Applies the native `open` attribute on first render. |
| `name` | `string \| undefined` | no | Groups sibling `<details name>` into an exclusive, single-open set — the browser enforces it, no JS. Must be unique per group and stable across SSR. |
| `disabled` | `boolean` | no |  |

### NativeDetailsSummaryOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |

### NativeDetailsContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

## Other types

- `NativeDetailsRootProps`: `NativeDetailsRootOwnProps & Omit<ComponentPropsWithRef<"details">, keyof NativeDetailsRootOwnProps>` — Native props may override the initial open state.
- `NativeDetailsSummaryProps`: `NativeDetailsSummaryOwnProps & Omit<ComponentPropsWithRef<"summary">, keyof NativeDetailsSummaryOwnProps>`
- `NativeDetailsContentProps<TAs>`: `RenderableProps<TAs, NativeDetailsContentOwnProps, Record<string, never>, HTMLElement>`

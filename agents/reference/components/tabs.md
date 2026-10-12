<!-- Generated from the package source. Do not edit by hand. -->
# tabs

- Import: `@gunkin/uiify/components/tabs`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/tabs.d.ts`
- Note: Data-driven native radio switcher; CSS-only panels. Built on @gunkin/uiify/elements/choice.

## Exports

- Runtime: `Tabs`
- Types: `TabsItem`, `TabsProps`

## Props and shapes

### TabsStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getValue` | `() => string \| undefined` | yes |  |
| `isSelected` | `(itemValue: string) => boolean` | yes |  |
| `setValue` | `(next: string \| undefined) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `subscribeItem` | `(itemValue: string, listener: () => void) => () => void` | yes |  |

### TabsItem

Extends: `ChoicePanelItem`

No own members.

### TabsProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly TabsItem[]` | yes |  |
| `defaultValue` | `string` | no |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `className` | `string` | no |  |
| `append` | `ReactNode` | no | Optional control rendered at the end of the tab bar. |

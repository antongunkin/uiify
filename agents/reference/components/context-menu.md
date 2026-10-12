<!-- Generated from the package source. Do not edit by hand. -->
# context-menu

- Import: `@gunkin/uiify/components/context-menu`
- Tier 2 (Client component — pre-hydration SSR); state source S2; native element `[popover]`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/context-menu.d.ts`

## Exports

- Runtime: `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuRadioItem`, `ContextMenuRoot`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`
- Types: `ContextMenuCheckboxItemOwnProps`, `ContextMenuContentOwnProps`, `ContextMenuContentProps`, `ContextMenuItemOwnProps`, `ContextMenuItemProps`, `ContextMenuRadioItemOwnProps`, `ContextMenuRootControlledOwnProps`, `ContextMenuRootShellOwnProps`, `ContextMenuRootShellProps`, `ContextMenuRootProps`, `ContextMenuSubContentOwnProps`, `ContextMenuSubOwnProps`, `ContextMenuSubTriggerOwnProps`, `ContextMenuTriggerOwnProps`, `ContextMenuTriggerProps`, `ContextMenuLabelOwnProps`, `ContextMenuSeparatorOwnProps`

## Props and shapes

### ContextMenuContextValue

Extends: `UseMenuSurfaceReturn`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `openAtPointer` | `(event: MouseEvent<HTMLElement>) => void` | yes | Opens at the pointer's coordinates: positions the virtual anchor, then opens. |
| `radioValue` | `string \| undefined` | yes |  |
| `setRadioValue` | `(value: string) => void` | yes |  |

### ContextMenuRootShellOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | no |  |
| `id` | `string` | no |  |

### ContextMenuRootControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onOpenChange` | `PopoverChangeHandler` | no |  |
| `open` | `boolean` | no |  |

### ContextMenuRootShellProps

Extends: `ContextMenuRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ContextMenuRootProps

Extends: `ContextMenuRootShellOwnProps`, `ContextMenuRootControlledOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ContextMenuTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ContextMenuContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ContextMenuItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `onSelect` | `(event: MenuSelectEvent) => void` | no |  |
| `textValue` | `string` | no |  |

### ContextMenuCheckboxItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| "indeterminate"` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `onCheckedChange` | `(checked: boolean) => void` | no |  |
| `textValue` | `string` | no |  |

### ContextMenuRadioItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `textValue` | `string` | no |  |
| `value` | `string` | yes |  |

### ContextMenuSubOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ContextMenuSubTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `textValue` | `string` | no |  |

### ContextMenuSubContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

## Other types

- `ContextMenuLabelOwnProps`: `DropdownMenuLabelOwnProps`
- `ContextMenuSeparatorOwnProps`: `DropdownMenuSeparatorOwnProps`
- `ContextMenuTriggerProps<TAs>`: `RenderableProps<TAs, ContextMenuTriggerOwnProps, { open: boolean }, HTMLElement>`
- `ContextMenuContentProps<TAs>`: `RenderableProps<TAs, ContextMenuContentOwnProps, { open: boolean }, HTMLElement>`
- `ContextMenuItemProps<TAs>`: `RenderableProps<TAs, ContextMenuItemOwnProps, { disabled: boolean }, HTMLElement>`

<!-- Generated from the package source. Do not edit by hand. -->
# dropdown-menu

- Import: `@gunkin/uiify/components/dropdown-menu`
- Tier 2 (Client component — pre-hydration SSR); state source S2; native element `[popover]+commandfor`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/dropdown-menu.d.ts`

## Exports

- Runtime: `DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuItemDescription`, `DropdownMenuItemIcon`, `DropdownMenuItemIndicator`, `DropdownMenuItemText`, `DropdownMenuLabel`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `DropdownMenuBar`
- Types: `MenuSelectEvent`, `DropdownMenuBarOwnProps`, `DropdownMenuBarProps`, `DropdownMenuContentOwnProps`, `DropdownMenuContentProps`, `DropdownMenuCheckedState`, `DropdownMenuCheckboxItemOwnProps`, `DropdownMenuCheckboxItemProps`, `DropdownMenuGroupOwnProps`, `DropdownMenuItemDescriptionProps`, `DropdownMenuItemIconProps`, `DropdownMenuItemIndicatorProps`, `DropdownMenuItemOwnProps`, `DropdownMenuItemProps`, `DropdownMenuItemTextProps`, `DropdownMenuLabelOwnProps`, `DropdownMenuOpenChangeDetails`, `DropdownMenuOpenChangeReason`, `DropdownMenuPartOwnProps`, `DropdownMenuPartProps`, `DropdownMenuRadioGroupOwnProps`, `DropdownMenuRadioGroupProps`, `DropdownMenuRadioItemOwnProps`, `DropdownMenuRadioItemProps`, `DropdownMenuRootControlledOwnProps`, `DropdownMenuRootShellOwnProps`, `DropdownMenuRootShellProps`, `DropdownMenuRootOwnProps`, `DropdownMenuRootProps`, `DropdownMenuSeparatorOwnProps`, `DropdownMenuShortcutProps`, `DropdownMenuSubContentProps`, `DropdownMenuSubOwnProps`, `DropdownMenuSubProps`, `DropdownMenuSubTriggerOwnProps`, `DropdownMenuSubTriggerProps`, `DropdownMenuTriggerOwnProps`, `DropdownMenuTriggerProps`

## Values

- `DropdownMenuOpenChangeReason`: `"trigger-press" | "item-select" | "escape" | "focus-out" | "outside-press" | "programmatic"`

## Props and shapes

### DropdownMenuOpenChangeDetails

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | `Event \| null` | yes |  |
| `reason` | `DropdownMenuOpenChangeReason` | yes |  |

### DropdownMenuContextValue

Extends: `UseMenuSurfaceReturn`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `cancelHoverClose` | `() => void` | yes |  |
| `dir` | `Direction` | no |  |
| `disabled` | `boolean` | yes |  |
| `hoverEnabledRef` | `RefObject<boolean>` | yes |  |
| `loop` | `boolean` | yes |  |
| `scheduleHoverClose` | `() => void` | yes |  |

### DropdownMenuBarOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `dir` | `Direction` | no |  |
| `loop` | `boolean` | no |  |

### DropdownMenuRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `dir` | `Direction` | no |  |
| `disabled` | `boolean` | no |  |
| `id` | `string` | no |  |
| `loop` | `boolean` | no |  |
| `onOpenChange` | `(open: boolean, details: DropdownMenuOpenChangeDetails) => void` | no |  |
| `open` | `boolean` | no |  |

### DropdownMenuTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `openOnHover` | `boolean` | no |  |

### DropdownMenuContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `side` | `AnchorSide` | no |  |

### DropdownMenuItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `closeOnSelect` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `onSelect` | `(event: MenuSelectEvent) => void` | no |  |
| `textValue` | `string` | no |  |

### DropdownMenuCheckboxItemOwnProps

Extends: `DropdownMenuItemOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `checked` | `DropdownMenuCheckedState` | no |  |
| `defaultChecked` | `DropdownMenuCheckedState` | no |  |
| `onCheckedChange` | `(checked: boolean) => void` | no |  |

### DropdownMenuRadioGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `defaultValue` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `value` | `string` | no |  |

### DropdownMenuRadioItemOwnProps

Extends: `DropdownMenuItemOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |

### DropdownMenuSubOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `onOpenChange` | `(open: boolean, details: DropdownMenuOpenChangeDetails) => void` | no |  |
| `open` | `boolean` | no |  |

### DropdownMenuSubTriggerOwnProps

Extends: `DropdownMenuItemOwnProps`

No own members.

### DropdownMenuPartOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DropdownMenuSubContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `contentRef` | `RefObject<HTMLElement \| null>` | yes |  |
| `open` | `boolean` | yes |  |
| `setOpen` | `(open: boolean, reason: DropdownMenuOpenChangeReason, event?: Event \| null) => void` | yes |  |
| `triggerRef` | `RefObject<HTMLElement \| null>` | yes |  |

## Other types

- `DropdownMenuCheckedState`: `boolean | "indeterminate"`
- `DropdownMenuBarProps`: `DropdownMenuBarOwnProps`
- `DropdownMenuRootProps`: `DropdownMenuRootOwnProps`
- `DropdownMenuRootShellOwnProps`: `DropdownMenuRootOwnProps`
- `DropdownMenuRootControlledOwnProps`: `Pick<DropdownMenuRootOwnProps, "onOpenChange" | "open">`
- `DropdownMenuRootShellProps`: `DropdownMenuRootOwnProps`
- `DropdownMenuTriggerProps<TAs>`: `RenderableProps<TAs, DropdownMenuTriggerOwnProps, { open: boolean }, HTMLElement>`
- `DropdownMenuContentProps<TAs>`: `RenderableProps<TAs, DropdownMenuContentOwnProps, { open: boolean }, HTMLElement>`
- `DropdownMenuItemProps<TAs>`: `RenderableProps<TAs, DropdownMenuItemOwnProps, { disabled: boolean }, HTMLElement>`
- `DropdownMenuCheckboxItemProps<TAs>`: `RenderableProps<TAs, DropdownMenuCheckboxItemOwnProps, { checked: DropdownMenuCheckedState; disabled: boolean }, HTMLElement>`
- `DropdownMenuRadioGroupProps<TAs>`: `RenderableProps<TAs, DropdownMenuRadioGroupOwnProps, { value: string | undefined }, HTMLElement>`
- `DropdownMenuRadioItemProps<TAs>`: `RenderableProps<TAs, DropdownMenuRadioItemOwnProps, { checked: boolean; disabled: boolean }, HTMLElement>`
- `DropdownMenuSubProps`: `DropdownMenuSubOwnProps`
- `DropdownMenuSubTriggerProps<TAs>`: `RenderableProps<TAs, DropdownMenuSubTriggerOwnProps, { disabled: boolean; open: boolean }, HTMLElement>`
- `DropdownMenuSubContentProps<TAs>`: `RenderableProps<TAs, DropdownMenuContentOwnProps, { open: boolean }, HTMLElement>`
- `DropdownMenuPartProps<TAs>`: `RenderableProps<TAs, DropdownMenuPartOwnProps, Record<string, never>, HTMLElement>`
- `DropdownMenuGroupOwnProps`: `DropdownMenuPartOwnProps`
- `DropdownMenuLabelOwnProps`: `DropdownMenuPartOwnProps`
- `DropdownMenuSeparatorOwnProps`: `Omit<DropdownMenuPartOwnProps, "children">`
- `DropdownMenuGroupProps<TAs>`: `MenuGroupProps<TAs>`
- `DropdownMenuLabelProps<TAs>`: `MenuLabelProps<TAs>`
- `DropdownMenuSeparatorProps<TAs>`: `MenuSeparatorProps<TAs>`
- `DropdownMenuItemIconProps<TAs>`: `DropdownMenuPartProps<TAs>`
- `DropdownMenuItemTextProps<TAs>`: `DropdownMenuPartProps<TAs>`
- `DropdownMenuItemDescriptionProps<TAs>`: `DropdownMenuPartProps<TAs>`
- `DropdownMenuShortcutProps<TAs>`: `DropdownMenuPartProps<TAs>`
- `DropdownMenuItemIndicatorProps<TAs>`: `DropdownMenuPartProps<TAs>`

<!-- Generated from the package source. Do not edit by hand. -->
# context-menu

- Import: `@gunkin/uiify/components/context-menu`
- Tier 2 (Client component — pre-hydration SSR); state source S2; native element `[popover]`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/context-menu.d.ts`

## Related knowledge

- Recipe: [context-menu](../../../skills/uiify/references/elements/context-menu.md)

## Exports

- Runtime: `ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuRadioItem`, `ContextMenuRoot`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`
- Types: `ContextMenuCheckboxItemOwnProps`, `ContextMenuContentOwnProps`, `ContextMenuContentProps`, `ContextMenuItemOwnProps`, `ContextMenuItemProps`, `ContextMenuRadioItemOwnProps`, `ContextMenuRootControlledOwnProps`, `ContextMenuRootShellOwnProps`, `ContextMenuRootShellProps`, `ContextMenuRootProps`, `ContextMenuRootSlotProps`, `ContextMenuSubContentOwnProps`, `ContextMenuSubOwnProps`, `ContextMenuSubTriggerOwnProps`, `ContextMenuTriggerOwnProps`, `ContextMenuTriggerProps`, `ContextMenuLabelOwnProps`, `ContextMenuSeparatorOwnProps`

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
| `slotProps` | `ContextMenuRootSlotProps` | no |  |

### ContextMenuRootSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `virtualAnchor` | `Omit<ComponentPropsWithRef<"span">, \| "aria-hidden" \| "children" \| "dangerouslySetInnerHTML" \| "data-anchor" \| "data-virtual-anchor" \| "data-uiify-menu"> & ConsumerDataAttributes & { readonly "data-anchor"?: never; readonly "data-uiify-menu"?: never; readonly "data-virtual-anchor"?: never; }` | no |  |

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

Extends: `Omit<ComponentPropsWithRef<"div">, | "aria-checked" | "children" | "data-disabled" | "data-part" | "data-state" | "data-uiify-menu" | "dangerouslySetInnerHTML" | "role">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| "indeterminate"` | no |  |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `onCheckedChange` | `(checked: boolean) => void` | no |  |
| `textValue` | `string` | no |  |
| `"aria-checked"` | `never` | no |  |
| `"data-disabled"` | `never` | no |  |
| `"data-part"` | `never` | no |  |
| `"data-state"` | `never` | no |  |
| `"data-uiify-menu"` | `never` | no |  |
| `role` | `never` | no |  |

### ContextMenuRadioItemOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, | "aria-checked" | "children" | "data-disabled" | "data-part" | "data-state" | "data-uiify-menu" | "dangerouslySetInnerHTML" | "role">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `textValue` | `string` | no |  |
| `value` | `string` | yes |  |
| `"aria-checked"` | `never` | no |  |
| `"data-disabled"` | `never` | no |  |
| `"data-part"` | `never` | no |  |
| `"data-state"` | `never` | no |  |
| `"data-uiify-menu"` | `never` | no |  |
| `role` | `never` | no |  |

### ContextMenuSubOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ContextMenuSubTriggerOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, | "aria-expanded" | "aria-haspopup" | "children" | "data-part" | "data-uiify-menu" | "dangerouslySetInnerHTML" | "role">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `textValue` | `string` | no |  |
| `"aria-expanded"` | `never` | no |  |
| `"aria-haspopup"` | `never` | no |  |
| `"data-part"` | `never` | no |  |
| `"data-uiify-menu"` | `never` | no |  |
| `role` | `never` | no |  |

### ContextMenuSubContentOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, | "children" | "data-part" | "data-state" | "data-uiify-menu" | "dangerouslySetInnerHTML" | "hidden" | "role">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `"data-part"` | `never` | no |  |
| `"data-state"` | `never` | no |  |
| `"data-uiify-menu"` | `never` | no |  |
| `role` | `never` | no |  |

## Other types

- `ContextMenuLabelOwnProps`: `DropdownMenuLabelOwnProps`
- `ContextMenuSeparatorOwnProps`: `DropdownMenuSeparatorOwnProps`
- `ContextMenuTriggerProps<TAs>`: `RenderableProps<TAs, ContextMenuTriggerOwnProps, { open: boolean }, HTMLElement>`
- `ContextMenuContentProps<TAs>`: `RenderableProps<TAs, ContextMenuContentOwnProps, { open: boolean }, HTMLElement>`
- `ContextMenuItemProps<TAs>`: `RenderableProps<TAs, ContextMenuItemOwnProps, { disabled: boolean }, HTMLElement>`

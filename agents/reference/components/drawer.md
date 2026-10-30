<!-- Generated from the package source. Do not edit by hand. -->
# drawer

- Import: `@gunkin/uiify/components/drawer`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/drawer.d.ts`
- Related native Element (manifest): [dialog](../elements/dialog.md)
- Note: DrawerPanel native shell + compound Drawer.* client API; snap-point drag on client entry.

## Related knowledge

- Recipe: [drawer](../../../skills/uiify/references/elements/drawer.md)

## Exports

- Runtime: `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerHandle`, `DrawerRoot`, `DrawerTitle`, `DrawerTrigger`, `DrawerPanel`, `DrawerNativeTrigger`, `DrawerNativeClose`, `DrawerNativeContent`
- Types: `DrawerCloseOwnProps`, `DrawerCloseProps`, `DrawerContentOwnProps`, `DrawerContentProps`, `DrawerDescriptionOwnProps`, `DrawerHandleOwnProps`, `DrawerRootOwnProps`, `DrawerRootProps`, `DrawerTitleOwnProps`, `DrawerTriggerOwnProps`, `DrawerTriggerProps`, `DrawerProps`, `DrawerLabels`, `DrawerSide`, `DrawerAppearanceProps`, `DrawerNativeContentProps`, `DrawerNativeInvokerProps`, `DrawerOwnProps`, `DrawerSlotProps`

## Values

- `DrawerSide`: `"top" | "right" | "bottom" | "left"`

## Props and shapes

### DrawerAppearanceProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | no |  |
| `dismiss` | `"any" \| "closerequest" \| "none"` | no |  |
| `backdrop` | `"opaque" \| "transparent"` | no |  |

### DrawerOwnProps

Extends: `DrawerAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `closeLabel` | `string` | no |  |
| `labels` | `Partial<DrawerLabels>` | no |  |
| `footer` | `ReactNode` | no |  |
| `side` | `DrawerSide` | no |  |
| `slotProps` | `DrawerSlotProps` | no | Native props for generated inner nodes; DrawerPanel's root takes props directly. |

### DrawerSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `DrawerInvokerSlotProps` | no |  |
| `content` | `Omit<SlotProps<"dialog">, "id" \| "open" \| "popover">` | no |  |
| `grabber` | `SlotProps<"div">` | no |  |
| `header` | `SlotProps<"div">` | no |  |
| `title` | `SlotProps<"h2">` | no |  |
| `description` | `SlotProps<"p">` | no |  |
| `close` | `DrawerInvokerSlotProps` | no |  |
| `body` | `SlotProps<"div">` | no |  |
| `footer` | `SlotProps<"div">` | no |  |

### DrawerLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `close` | `string` | yes |  |

### DrawerNativeContentProps

Extends: `Omit<ComponentPropsWithRef<"dialog">, "open" | "popover" | "dangerouslySetInnerHTML">`, `DrawerAppearanceProps`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `side` | `DrawerSide` | no |  |

### DrawerStoreOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `activeSnapPoint` | `number` | no |  |
| `defaultActiveSnapPoint` | `number` | no |  |
| `dismissible` | `boolean` | no |  |
| `onDismiss` | `() => void` | no |  |
| `onSnapChange` | `(snap: number) => void` | no |  |
| `side` | `DrawerSide` | yes |  |
| `snapPoints` | `readonly number[]` | no |  |

### DrawerStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `endDrag` | `() => void` | yes |  |
| `getActiveSnapPoint` | `() => number` | yes |  |
| `getDragOffset` | `() => number` | yes |  |
| `getTransform` | `() => string` | yes |  |
| `isDragging` | `() => boolean` | yes |  |
| `moveDrag` | `(clientCoord: number) => void` | yes |  |
| `setSide` | `(side: DrawerSide) => void` | yes |  |
| `setContainerSize` | `(size: number) => void` | yes |  |
| `startDrag` | `(clientCoord: number) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `syncActiveSnapPoint` | `(snap: number) => void` | yes |  |

### DrawerContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `close` | `(returnValue?: string) => void` | yes |  |
| `contentId` | `string` | yes |  |
| `descriptionId` | `string \| undefined` | yes |  |
| `dialogProps` | `UseDialogReturn["dialogProps"]` | yes |  |
| `dialogRef` | `UseDialogReturn["dialogRef"]` | yes |  |
| `dismissible` | `boolean` | yes |  |
| `closeOnOverlayClick` | `boolean` | yes |  |
| `labelId` | `string \| undefined` | yes |  |
| `modal` | `boolean` | yes |  |
| `open` | `boolean` | yes |  |
| `openDialog` | `() => void` | yes |  |
| `setDescriptionId` | `(id: string \| undefined) => void` | yes |  |
| `setLabelId` | `(id: string \| undefined) => void` | yes |  |
| `side` | `DrawerSide` | yes |  |
| `snapEnabled` | `boolean` | yes |  |
| `store` | `DrawerStore` | yes |  |
| `triggerRef` | `RefObject<HTMLButtonElement \| null>` | yes |  |

### DrawerRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `activeSnapPoint` | `number` | no |  |
| `closeOnOverlayClick` | `boolean` | no |  |
| `defaultActiveSnapPoint` | `number` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `dismissible` | `boolean` | no |  |
| `modal` | `boolean` | no |  |
| `onOpenChange` | `DialogChangeHandler` | no |  |
| `onSnapChange` | `(snap: number) => void` | no |  |
| `open` | `boolean` | no |  |
| `side` | `DrawerSide` | no |  |
| `snapPoints` | `readonly number[]` | no |  |

### DrawerRootProps

Extends: `DrawerRootOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### DrawerTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerTriggerProps

Extends: `DrawerTriggerOwnProps`, `Omit<ComponentPropsWithRef<"button">, keyof DrawerTriggerOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |
| `ref` | `Ref<HTMLButtonElement>` | no |  |

### DrawerContentOwnProps

Extends: `DrawerAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `style` | `CSSProperties` | no |  |

### DrawerContentProps

Extends: `DrawerContentOwnProps`, `Omit<ComponentPropsWithRef<"dialog">, "open" | keyof DrawerContentOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onCancel` | `DrawerContextValue["dialogProps"]["onCancel"]` | no |  |
| `onClose` | `DrawerContextValue["dialogProps"]["onClose"]` | no |  |
| `ref` | `Ref<HTMLDialogElement>` | no |  |

### DrawerTitleOwnProps

Extends: `ComponentPropsWithRef<"h2">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerDescriptionOwnProps

Extends: `ComponentPropsWithRef<"p">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerCloseProps

Extends: `DrawerCloseOwnProps`, `Omit<ComponentPropsWithRef<"button">, keyof DrawerCloseOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |

### DrawerHandleOwnProps

Extends: `ComponentPropsWithRef<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `onPointerCancel` | `(event: PointerEvent<HTMLDivElement>) => void` | no |  |
| `onPointerDown` | `(event: PointerEvent<HTMLDivElement>) => void` | no |  |
| `onPointerMove` | `(event: PointerEvent<HTMLDivElement>) => void` | no |  |
| `onPointerUp` | `(event: PointerEvent<HTMLDivElement>) => void` | no |  |

## Other types

- `DrawerProps`: `DrawerOwnProps & Omit<SlotProps<"div">, keyof DrawerOwnProps>`
- `DrawerNativeInvokerProps`: `NativeButtonProps<"button", { readonly target: string }> & ConsumerDataAttributes`

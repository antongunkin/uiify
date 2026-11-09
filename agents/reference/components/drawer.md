<!-- Generated from the package source. Do not edit by hand. -->
# drawer

- Import: `@gunkin/uiify/components/drawer`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/drawer.d.ts`
- Related native Element (manifest): [native-dialog](../elements/native-dialog.md)
- Note: Tier 0 Drawer (native dialog shell, show-modal/request-close) in the root entry; the client Drawer (controlled state, snap-point drag, shadcn/Vaul names) is @gunkin/uiify/components/drawer/client.

## Related knowledge

- Recipe: [drawer](../../../skills/uiify/references/elements/drawer.md)

## Exports

- Runtime: `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerTrigger`, `DrawerBody`, `DrawerDescription`, `DrawerFooter`, `DrawerGrabber`, `DrawerHeader`, `DrawerTitle`
- Types: `DrawerAppearanceProps`, `DrawerBodyProps`, `DrawerCloseProps`, `DrawerContentProps`, `DrawerDescriptionProps`, `DrawerFooterProps`, `DrawerGrabberProps`, `DrawerHeaderProps`, `DrawerLabels`, `DrawerOwnProps`, `DrawerProps`, `DrawerSide`, `DrawerSlotProps`, `DrawerTitleProps`, `DrawerTriggerProps`

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
| `slotProps` | `DrawerSlotProps` | no | Native props for generated inner nodes; Drawer's root takes props directly. |

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

### DrawerContentProps

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

### DrawerClientOwnProps

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

### DrawerClientProps

Extends: `DrawerClientOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### DrawerClientTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerClientTriggerProps

Extends: `DrawerClientTriggerOwnProps`, `Omit<ComponentPropsWithRef<"button">, keyof DrawerClientTriggerOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |
| `ref` | `Ref<HTMLButtonElement>` | no |  |

### DrawerClientContentOwnProps

Extends: `DrawerAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `style` | `CSSProperties` | no |  |

### DrawerClientContentProps

Extends: `DrawerClientContentOwnProps`, `Omit<ComponentPropsWithRef<"dialog">, "open" | keyof DrawerClientContentOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onCancel` | `DrawerContextValue["dialogProps"]["onCancel"]` | no |  |
| `onClose` | `DrawerContextValue["dialogProps"]["onClose"]` | no |  |
| `ref` | `Ref<HTMLDialogElement>` | no |  |

### DrawerClientTitleOwnProps

Extends: `ComponentPropsWithRef<"h2">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerClientDescriptionOwnProps

Extends: `ComponentPropsWithRef<"p">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerClientCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### DrawerClientCloseProps

Extends: `DrawerClientCloseOwnProps`, `Omit<ComponentPropsWithRef<"button">, keyof DrawerClientCloseOwnProps>`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |

### DrawerClientHandleOwnProps

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
- `DrawerTriggerProps`: `NativeButtonProps<"button", { readonly target: string }> & ConsumerDataAttributes`
- `DrawerCloseProps`: `DrawerTriggerProps` — Closes the drawer whose `id` is `target` (`request-close`).
- `DrawerHeaderProps`: `ComponentPropsWithRef<"div">`
- `DrawerTitleProps`: `ComponentPropsWithRef<"h2">`
- `DrawerDescriptionProps`: `ComponentPropsWithRef<"p">`
- `DrawerBodyProps`: `ComponentPropsWithRef<"div">`
- `DrawerFooterProps`: `ComponentPropsWithRef<"div">`
- `DrawerGrabberProps`: `Omit<ComponentPropsWithRef<"div">, "children">`

<!-- Generated from the package source. Do not edit by hand. -->
# toast

- Import: `@gunkin/uiify/components/toast`
- Tier 1 (RSC shell + thin client island); state source S1; native element `[popover] + aria-live`
- Without JavaScript: degraded-documented
- Types file: `dist/components/toast.d.ts`

## Related knowledge

- Recipe: [toast](../../../skills/uiify/references/elements/toast.md)

## Exports

- Runtime: `Toast`, `ToastAction`, `ToastClose`, `ToastDescription`, `ToastProvider`, `ToastRoot`, `ToastTitle`, `ToastViewport`, `useToast`
- Types: `ToastActionOwnProps`, `ToastActionProps`, `ToastCloseOwnProps`, `ToastCloseProps`, `ToastLabels`, `ToastProviderSlotProps`, `ToastRootSlotProps`, `ToastViewportSlotProps`, `ToastItemSlotProps`, `ToastTitleSlotProps`, `ToastDescriptionSlotProps`, `ToastActionSlotProps`, `ToastCloseSlotProps`, `ToastDescriptionOwnProps`, `ToastProviderOwnProps`, `ToastRootOwnProps`, `ToastTitleOwnProps`, `ToastViewportOwnProps`, `ToastInput`, `ToastPriority`, `ToastRecord`, `ToastStore`

## Values

- `ToastPriority`: `"polite" | "assertive"`

## Props and shapes

### ToastLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `region` | `string` | yes |  |
| `notification` | `string` | yes |  |
| `close` | `string` | yes |  |

### ToastAction

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes |  |
| `onClick` | `() => void` | yes |  |

### ToastInput

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | `ToastAction` | no |  |
| `description` | `ReactNode` | no |  |
| `duration` | `number` | no |  |
| `id` | `string` | no |  |
| `priority` | `ToastPriority` | no |  |
| `title` | `ReactNode` | no |  |

### ToastRecord

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | `ToastAction` | no |  |
| `description` | `ReactNode` | no |  |
| `duration` | `number` | yes |  |
| `id` | `string` | yes |  |
| `priority` | `ToastPriority` | yes |  |
| `title` | `ReactNode` | no |  |

### TimerState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `remaining` | `number` | yes |  |
| `startedAt` | `number` | yes |  |
| `timerId` | `ReturnType<typeof setTimeout> \| null` | yes |  |

### ToastStoreOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `number` | no |  |

### ToastStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `dismiss` | `(id: string) => void` | yes |  |
| `enqueue` | `(input: ToastInput) => string` | yes |  |
| `getAnnouncement` | `() => string` | yes |  |
| `getAssertiveAnnouncement` | `() => string` | yes |  |
| `getSnapshot` | `() => readonly ToastRecord[]` | yes |  |
| `getServerSnapshot` | `() => readonly ToastRecord[]` | yes |  |
| `pause` | `(id: string) => void` | yes |  |
| `resume` | `(id: string) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |

### ToastContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `dismiss` | `(id: string) => void` | yes |  |
| `pause` | `(id: string) => void` | yes |  |
| `resume` | `(id: string) => void` | yes |  |
| `store` | `ToastStore` | yes |  |
| `labels` | `ToastLabels` | yes |  |

### ToastRootSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `ToastTitleSlotProps` | no |  |
| `description` | `ToastDescriptionSlotProps` | no |  |
| `action` | `ToastActionSlotProps` | no |  |
| `close` | `ToastCloseSlotProps` | no |  |

### ToastViewportSlotProps

Extends: `ToastRootSlotProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | `ToastItemSlotProps` | no |  |

### ToastProviderSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `politeLiveRegion` | `SlotProps<"span">` | no |  |
| `assertiveLiveRegion` | `SlotProps<"span">` | no |  |

### ToastProviderOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `labels` | `Partial<ToastLabels>` | no |  |
| `limit` | `number` | no |  |
| `slotProps` | `ToastProviderSlotProps` | no |  |

### ToastViewportOwnProps

Extends: `Omit<ComponentPropsWithRef<"section">, "dangerouslySetInnerHTML">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `Partial<ToastLabels>` | no |  |
| `slotProps` | `ToastViewportSlotProps` | no |  |

### ToastRootOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `Partial<ToastLabels>` | no |  |
| `slotProps` | `ToastRootSlotProps` | no |  |
| `toast` | `ToastRecord` | yes |  |

### ToastTitleOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ToastDescriptionOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ToastActionOwnProps

Extends: `Omit<ComponentPropsWithRef<"button">, "children" | "dangerouslySetInnerHTML">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ToastActionProps

Extends: `ToastActionOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `((event: MouseEvent<HTMLButtonElement>) => void) \| undefined` | no |  |

### ToastCloseOwnProps

Extends: `Omit<ComponentPropsWithRef<"button">, "children" | "dangerouslySetInnerHTML">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `labels` | `Partial<ToastLabels>` | no |  |

### ToastCloseProps

Extends: `ToastCloseOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `((event: MouseEvent<HTMLButtonElement>) => void) \| undefined` | no |  |

## Other types

- `ToastItemSlotProps`: `RepeatedSlotProps<SlotProps<"div">>`
- `ToastTitleSlotProps`: `RepeatedSlotProps<SlotProps<"div">>`
- `ToastDescriptionSlotProps`: `ToastTitleSlotProps`
- `ToastActionSlotProps`: `RepeatedSlotProps<SlotProps<"button">>`
- `ToastCloseSlotProps`: `RepeatedSlotProps<SlotProps<"button">>`

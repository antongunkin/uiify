<!-- Generated from the package source. Do not edit by hand. -->
# toast

- Import: `@gunkin/uiify/components/toast`
- Tier 1 (RSC shell + thin client island); state source S1; native element `[popover] + aria-live`
- Without JavaScript: degraded-documented
- Types file: `dist/components/toast.d.ts`

## Exports

- Runtime: `Toast`, `ToastAction`, `ToastClose`, `ToastDescription`, `ToastProvider`, `ToastRoot`, `ToastTitle`, `ToastViewport`, `useToast`
- Types: `ToastActionOwnProps`, `ToastActionProps`, `ToastCloseOwnProps`, `ToastCloseProps`, `ToastLabels`, `ToastDescriptionOwnProps`, `ToastProviderOwnProps`, `ToastRootOwnProps`, `ToastTitleOwnProps`, `ToastViewportOwnProps`, `ToastInput`, `ToastPriority`, `ToastRecord`, `ToastStore`

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

### ToastProviderOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `labels` | `Partial<ToastLabels>` | no |  |
| `limit` | `number` | no |  |

### ToastViewportOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"aria-label"` | `string` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `labels` | `Partial<ToastLabels>` | no |  |
| `popover` | `"manual"` | no | Set by the live client viewport (@gunkin/uiify/components/toast/Toast.js) to `"manual"` so the queue's rendered surface sits in the top layer. The structural shell (this file's own re-exported ToastViewport, used directly by "Toast server shell" tests and any no-JS render) leaves it unset, since there is no queue-driven show/hide to wire up there. |
| `ref` | `Ref<HTMLElement>` | no |  |

### ToastRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `Partial<ToastLabels>` | no |  |
| `toast` | `ToastRecord` | yes |  |

### ToastTitleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ToastDescriptionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ToastActionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ToastActionProps

Extends: `ToastActionOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |

### ToastCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `labels` | `Partial<ToastLabels>` | no |  |

### ToastCloseProps

Extends: `ToastCloseOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | no |  |

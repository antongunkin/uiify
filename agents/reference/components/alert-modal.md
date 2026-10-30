<!-- Generated from the package source. Do not edit by hand. -->
# alert-modal

- Import: `@gunkin/uiify/components/alert-modal`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog[role=alertdialog] + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/alert-modal.d.ts`
- Related native Element (manifest): [dialog](../elements/dialog.md)
- Note: Native modal alertdialog via show-modal; Cancel/Action are request-close invokers. Baseline Chrome 139 / Firefox 147 / Safari 26.2; below it UIEnhance's invoker fallback runs the command after hydration.

## Related knowledge

- Recipe: [alert-modal](../../../skills/uiify/references/elements/alert-modal.md)
- Example: [alert-confirmation](../../../skills/uiify/references/examples/alert-confirmation.md)

## Exports

- Runtime: `AlertModal`, `AlertModalAction`, `AlertModalCancel`, `AlertModalContent`, `AlertModalTrigger`
- Types: `AlertModalActionOwnProps`, `AlertModalActionProps`, `AlertModalCancelOwnProps`, `AlertModalCancelProps`, `AlertModalContentOwnProps`, `AlertModalContentProps`, `AlertModalOwnProps`, `AlertModalProps`, `AlertModalSlotProps`, `AlertModalTriggerOwnProps`, `AlertModalTriggerProps`

## Props and shapes

### AlertModalOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `actionLabel` | `ReactNode` | no |  |
| `cancelLabel` | `ReactNode` | no |  |
| `slotProps` | `AlertModalSlotProps` | no | Native props for each generated part; the AlertModal root takes props directly. |

### AlertModalSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `AlertModalInvokerSlotProps` | no |  |
| `content` | `Omit<SlotProps<"dialog">, "id" \| "open" \| "popover">` | no |  |
| `title` | `SlotProps<"h2">` | no |  |
| `description` | `SlotProps<"p">` | no |  |
| `cancel` | `AlertModalInvokerSlotProps` | no |  |
| `action` | `AlertModalInvokerSlotProps` | no |  |

### AlertModalTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `AlertModalContent` this button opens. |

### AlertModalActionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes |  |

### AlertModalCancelOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes |  |

### AlertModalContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes |  |

## Other types

- `AlertModalProps`: `AlertModalOwnProps & Omit<SlotProps<"div">, keyof AlertModalOwnProps>`
- `AlertModalTriggerProps<TAs>`: `NativeButtonProps<TAs, AlertModalTriggerOwnProps> & ConsumerDataAttributes`
- `AlertModalActionProps<TAs>`: `NativeButtonProps<TAs, AlertModalActionOwnProps> & ConsumerDataAttributes`
- `AlertModalCancelProps<TAs>`: `NativeButtonProps<TAs, AlertModalCancelOwnProps> & ConsumerDataAttributes`
- `AlertModalContentProps`: `AlertModalContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof AlertModalContentOwnProps | "open" | "popover" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes` — `<dialog role="alertdialog">`; `open` and `popover` use the native modal contract.

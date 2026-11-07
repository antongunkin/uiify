<!-- Generated from the package source. Do not edit by hand. -->
# alert-dialog

- Import: `@gunkin/uiify/components/alert-dialog`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog[role=alertdialog] + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/alert-dialog.d.ts`
- Related native Element (manifest): [native-dialog](../elements/native-dialog.md)
- Note: Native modal alertdialog via show-modal; Cancel/Action are request-close invokers. Baseline Chrome 139 / Firefox 147 / Safari 26.2; below it UIEnhance's invoker fallback runs the command after hydration.

## Related knowledge

- Recipe: [alert-dialog](../../../skills/uiify/references/elements/alert-dialog.md)
- Example: [alert-confirmation](../../../skills/uiify/references/examples/alert-confirmation.md)

## Exports

- Runtime: `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogTrigger`
- Types: `AlertDialogActionOwnProps`, `AlertDialogActionProps`, `AlertDialogCancelOwnProps`, `AlertDialogCancelProps`, `AlertDialogContentOwnProps`, `AlertDialogContentProps`, `AlertDialogOwnProps`, `AlertDialogProps`, `AlertDialogSlotProps`, `AlertDialogTriggerOwnProps`, `AlertDialogTriggerProps`

## Props and shapes

### AlertDialogOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `actionLabel` | `ReactNode` | no |  |
| `cancelLabel` | `ReactNode` | no |  |
| `slotProps` | `AlertDialogSlotProps` | no | Native props for each generated part; the AlertDialog root takes props directly. |

### AlertDialogSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `AlertDialogInvokerSlotProps` | no |  |
| `content` | `Omit<SlotProps<"dialog">, "id" \| "open" \| "popover">` | no |  |
| `title` | `SlotProps<"h2">` | no |  |
| `description` | `SlotProps<"p">` | no |  |
| `cancel` | `AlertDialogInvokerSlotProps` | no |  |
| `action` | `AlertDialogInvokerSlotProps` | no |  |

### AlertDialogTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `AlertDialogContent` this button opens. |

### AlertDialogActionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes |  |

### AlertDialogCancelOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes |  |

### AlertDialogContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes |  |

## Other types

- `AlertDialogProps`: `AlertDialogOwnProps & Omit<SlotProps<"div">, keyof AlertDialogOwnProps>`
- `AlertDialogTriggerProps<TAs>`: `NativeButtonProps<TAs, AlertDialogTriggerOwnProps> & ConsumerDataAttributes`
- `AlertDialogActionProps<TAs>`: `NativeButtonProps<TAs, AlertDialogActionOwnProps> & ConsumerDataAttributes`
- `AlertDialogCancelProps<TAs>`: `NativeButtonProps<TAs, AlertDialogCancelOwnProps> & ConsumerDataAttributes`
- `AlertDialogContentProps`: `AlertDialogContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof AlertDialogContentOwnProps | "open" | "popover" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes` — `<dialog role="alertdialog">`; `open` and `popover` use the native modal contract.

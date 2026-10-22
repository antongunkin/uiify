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
- Types: `AlertModalActionOwnProps`, `AlertModalActionProps`, `AlertModalCancelOwnProps`, `AlertModalCancelProps`, `AlertModalContentOwnProps`, `AlertModalContentProps`, `AlertModalProps`, `AlertModalTriggerOwnProps`, `AlertModalTriggerProps`

## Props and shapes

### AlertModalProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `actionLabel` | `ReactNode` | no |  |
| `cancelLabel` | `ReactNode` | no |  |
| `className` | `string` | no |  |

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

- `AlertModalTriggerProps<TAs>`: `NativeButtonProps<TAs, AlertModalTriggerOwnProps>`
- `AlertModalActionProps<TAs>`: `NativeButtonProps<TAs, AlertModalActionOwnProps>`
- `AlertModalCancelProps<TAs>`: `NativeButtonProps<TAs, AlertModalCancelOwnProps>`
- `AlertModalContentProps`: `AlertModalContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof AlertModalContentOwnProps | "open" | "popover" | "role">` — `<dialog role="alertdialog">`; `role`, `open` and `popover` belong to the part.

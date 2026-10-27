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
| `content` | `AlertModalSlotElementProps<"dialog", \| "id" \| "role" \| "open" \| "popover" \| "aria-describedby" \| "aria-labelledby" \| "data-part" \| "data-uiify-alert-modal">` | no |  |
| `title` | `AlertModalSlotElementProps<"h2", "id" \| "data-part" \| "data-uiify-alert-modal">` | no |  |
| `description` | `AlertModalSlotElementProps<"p", "id" \| "data-part" \| "data-uiify-alert-modal">` | no |  |
| `cancel` | `AlertModalChoiceSlotProps` | no |  |
| `action` | `AlertModalChoiceSlotProps` | no |  |

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

- `AlertModalProps`: `AlertModalOwnProps & Omit<AlertModalSlotElementProps<"div", "data-part" | "data-uiify-alert-modal">, keyof AlertModalOwnProps>`
- `AlertModalTriggerProps<TAs>`: `Omit<NativeButtonProps<TAs, AlertModalTriggerOwnProps>, "dangerouslySetInnerHTML"> & ConsumerDataAttributes & { readonly "data-part"?: never; readonly "data-uiify-button"?: never; readonly "data-uiify-alert-modal"?: never; }`
- `AlertModalActionProps<TAs>`: `Omit<NativeButtonProps<TAs, AlertModalActionOwnProps>, "dangerouslySetInnerHTML"> & ConsumerDataAttributes & { readonly "data-part"?: never; readonly "data-variant"?: never; readonly "data-uiify-button"?: never; readonly "data-uiify-alert-modal"?: never; }`
- `AlertModalCancelProps<TAs>`: `Omit<NativeButtonProps<TAs, AlertModalCancelOwnProps>, "dangerouslySetInnerHTML"> & ConsumerDataAttributes & { readonly "data-part"?: never; readonly "data-variant"?: never; readonly "data-uiify-button"?: never; readonly "data-uiify-alert-modal"?: never; }`
- `AlertModalContentProps`: `AlertModalContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof AlertModalContentOwnProps | "open" | "popover" | "role" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes & { readonly "data-part"?: never; readonly "data-uiify-alert-modal"?: never; }` — `<dialog role="alertdialog">`; `role`, `open` and `popover` belong to the part.

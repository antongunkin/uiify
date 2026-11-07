<!-- Generated from the package source. Do not edit by hand. -->
# native-dialog

- Import: `@gunkin/uiify/elements/native-dialog`
- Native mechanism: dialog + command=show-modal
- Parts: `NativeDialog.Trigger`, `NativeDialog.Content`, `NativeDialog.Close`
- Used by: [dialog](../components/dialog.md), [alert-dialog](../components/alert-dialog.md), [drawer](../components/drawer.md)
- Types file: `dist/elements/native-dialog.d.ts`

## Exports

- Runtime: `NativeDialog`, `NativeDialogClose`, `NativeDialogContent`, `NativeDialogTrigger`
- Types: `NativeDialogCloseOwnProps`, `NativeDialogCloseProps`, `NativeDialogContentNameProps`, `NativeDialogContentOwnProps`, `NativeDialogContentProps`, `NativeDialogTriggerOwnProps`, `NativeDialogTriggerProps`

## Props and shapes

### NativeDialogTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `NativeDialog.Content` this button opens; the browser resolves it at click time. |

### NativeDialogCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `NativeDialog.Content` this button closes. |

### NativeDialogContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |

## Other types

- `NativeDialogTriggerProps<TAs>`: `NativeButtonProps<TAs, NativeDialogTriggerOwnProps>`
- `NativeDialogCloseProps<TAs>`: `NativeButtonProps<TAs, NativeDialogCloseOwnProps>`
- `NativeDialogContentNameProps`: `{ readonly "aria-labelledby": string; readonly "aria-label"?: never } | { readonly "aria-label": string; readonly "aria-labelledby"?: never }` — An unnamed `<dialog>` is an axe violation the browser has no fallback for, so the accessible name is a type error to omit — exactly one of `aria-labelledby` or `aria-label` is required.
- `NativeDialogContentProps`: `NativeDialogContentOwnProps & NativeDialogContentNameProps & Omit<ComponentPropsWithRef<"dialog">, keyof NativeDialogContentOwnProps | "open" | "popover" | "aria-label" | "aria-labelledby">` — A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract, and the accessible name is required (see `NativeDialogContentNameProps`).

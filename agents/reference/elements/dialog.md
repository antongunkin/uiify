<!-- Generated from the package source. Do not edit by hand. -->
# dialog

- Import: `@gunkin/uiify/elements/dialog`
- Native mechanism: dialog + command=show-modal
- Parts: `Dialog.Trigger`, `Dialog.Content`, `Dialog.Close`
- Used by: [modal](../components/modal.md), [alert-modal](../components/alert-modal.md), [drawer](../components/drawer.md)
- Types file: `dist/elements/dialog.d.ts`

## Exports

- Runtime: `Dialog`, `DialogClose`, `DialogContent`, `DialogTrigger`
- Types: `DialogCloseOwnProps`, `DialogCloseProps`, `DialogContentNameProps`, `DialogContentOwnProps`, `DialogContentProps`, `DialogTriggerOwnProps`, `DialogTriggerProps`

## Props and shapes

### DialogTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `Dialog.Content` this button opens; the browser resolves it at click time. |

### DialogCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `Dialog.Content` this button closes. |

### DialogContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |

## Other types

- `DialogTriggerProps<TAs>`: `NativeButtonProps<TAs, DialogTriggerOwnProps>`
- `DialogCloseProps<TAs>`: `NativeButtonProps<TAs, DialogCloseOwnProps>`
- `DialogContentNameProps`: `{ readonly "aria-labelledby": string; readonly "aria-label"?: never } | { readonly "aria-label": string; readonly "aria-labelledby"?: never }` — An unnamed `<dialog>` is an axe violation the browser has no fallback for, so the accessible name is a type error to omit — exactly one of `aria-labelledby` or `aria-label` is required.
- `DialogContentProps`: `DialogContentOwnProps & DialogContentNameProps & Omit<ComponentPropsWithRef<"dialog">, keyof DialogContentOwnProps | "open" | "popover" | "aria-label" | "aria-labelledby">` — A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract, and the accessible name is required (see `DialogContentNameProps`).

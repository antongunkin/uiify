<!-- Generated from the package source. Do not edit by hand. -->
# dialog

- Import: `@gunkin/uiify/components/dialog`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/dialog.d.ts`
- Related native Element (manifest): [native-invoker](../elements/native-invoker.md), [native-dialog](../elements/native-dialog.md)
- Note: True modal via show-modal/request-close; the browser owns inertness, Escape and focus return. Controlled/initially open state lives in @gunkin/uiify/components/dialog/client. Trigger/Close built on @gunkin/uiify/elements/native-dialog. Backdrop tap and swipe-down are optional UIEnhance improvements; without them the modal still closes by icon, Escape and (Chrome/Firefox) backdrop tap.

## Related knowledge

- Recipe: [dialog](../../../skills/uiify/references/elements/dialog.md)

## Exports

- Runtime: `Dialog`, `DialogBody`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogGrabber`, `DialogHeader`, `DialogTitle`, `DialogTrigger`
- Types: `DialogAlign`, `DialogAppearanceProps`, `DialogBackdrop`, `DialogBodyProps`, `DialogCloseOwnProps`, `DialogCloseProps`, `DialogContentOwnProps`, `DialogContentProps`, `DialogDescriptionProps`, `DialogDismiss`, `DialogFooterProps`, `DialogGrabberProps`, `DialogHeaderProps`, `DialogProps`, `DialogLabels`, `DialogOwnProps`, `DialogSlotProps`, `DialogSize`, `DialogTitleProps`, `DialogTriggerOwnProps`, `DialogTriggerProps`

## Values

- `DialogSize`: `"sm" | "md" | "lg" | "full"`
- `DialogAlign`: `"center" | "start"`
- `DialogDismiss`: `"any" | "closerequest" | "none"`
- `DialogBackdrop`: `"opaque" | "blur" | "none"`

## Props and shapes

### DialogAppearanceProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `size` | `DialogSize \| undefined` | no | Width step; `full` fills the viewport. Default `md`. |
| `align` | `DialogAlign \| undefined` | no | Vertical position on tablet and desktop; phones get a bottom sheet unless `size` is `full`. Default `center`. |
| `dismiss` | `DialogDismiss \| undefined` | no | Native `closedby`: `any` also closes on a backdrop tap, `closerequest` on Escape only, `none` only through your own controls. Default `any`. Engines without `closedby` (Safari) ignore it: Escape still closes the dialog there, and `UIEnhance` honours it only for its own backdrop tap (`any` only) and sheet swipe (off for `none`). |
| `backdrop` | `DialogBackdrop \| undefined` | no | Backdrop treatment. Default `opaque`. |

### DialogOwnProps

Extends: `DialogAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `closeLabel` | `string` | no | Accessible name of the header close icon. |
| `labels` | `Partial<DialogLabels>` | no |  |
| `footer` | `ReactNode` | no | Actions row pinned under the body. |
| `slotProps` | `DialogSlotProps` | no | Native props for the elements created by this convenience component. |

### DialogSlotProps

Native props for Dialog's generated inner elements; consumer values replace the defaults.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `CommandInvokerSlotProps` | no |  |
| `content` | `Omit<SlotProps<"dialog">, "id" \| "open" \| "popover">` | no |  |
| `grabber` | `SlotProps<"div">` | no |  |
| `header` | `SlotProps<"div">` | no |  |
| `title` | `SlotProps<"h2">` | no |  |
| `description` | `SlotProps<"p">` | no |  |
| `close` | `CommandInvokerSlotProps` | no |  |
| `body` | `SlotProps<"div">` | no |  |
| `footer` | `SlotProps<"div">` | no |  |

### DialogLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `close` | `string` | yes |  |

### DialogTriggerOwnProps

Own props of the native `show-modal` invoker.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `DialogContent` this button opens; the browser resolves it at click time. |

### DialogCloseOwnProps

Own props of the native `request-close` invoker.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `DialogContent` this button closes. |

### DialogContentOwnProps

Extends: `DialogAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |

### DialogClientContentOwnProps

Extends: `DialogAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no | Uncontrolled initial state, applied with `showModal()` after hydration; SSR markup stays closed. |
| `id` | `string` | yes |  |
| `onOpenChange` | `(open: boolean) => void` | no | Fires once per native or programmatic change with the state the element just entered. Also fires once at mount if the browser opened the dialog natively before hydration. Not reported: a pre-hydration open→close cycle that nets back to closed — the DOM retains no `toggle` history, so there is no evidence left that a transition happened at all. |
| `onOpenChangeComplete` | `(open: boolean) => void` | no | Fires once per open or close transition, after the dialog's CSS transitions have finished (immediately when there are none). This includes the transition that applies `defaultOpen` after hydration; it does not fire for a dialog that never changes state. |
| `open` | `boolean` | no | Controlled state, authoritative after hydration. |

## Other types

- `DialogProps`: `DialogOwnProps & Omit<SlotProps<"div">, keyof DialogOwnProps>` — Native props for Dialog's root div plus its dialog and trigger contract.
- `DialogTriggerProps<TAs>`: `NativeButtonProps<TAs, DialogTriggerOwnProps>`
- `DialogCloseProps<TAs>`: `NativeButtonProps<TAs, DialogCloseOwnProps>`
- `DialogContentProps`: `DialogContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof DialogContentOwnProps | "open" | "popover">` — A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract.
- `DialogClientContentProps`: `DialogClientContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof DialogClientContentOwnProps | "popover">` — Props of the client adapter; `popover` is excluded because the adapter is always modal.
- `DialogHeaderProps`: `ComponentPropsWithRef<"div">`
- `DialogTitleProps`: `ComponentPropsWithRef<"h2">`
- `DialogDescriptionProps`: `ComponentPropsWithRef<"p">`
- `DialogBodyProps`: `ComponentPropsWithRef<"div">`
- `DialogFooterProps`: `ComponentPropsWithRef<"div">`
- `DialogGrabberProps`: `Omit<ComponentPropsWithRef<"div">, "children">`

## Sub-entries

### `@gunkin/uiify/components/dialog/client`

- Runtime: `DialogClientContent`
- Types: `DialogClientContentOwnProps`, `DialogClientContentProps`

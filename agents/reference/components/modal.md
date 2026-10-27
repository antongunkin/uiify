<!-- Generated from the package source. Do not edit by hand. -->
# modal

- Import: `@gunkin/uiify/components/modal`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `dialog + command=show-modal`
- Without JavaScript: full
- Types file: `dist/components/modal.d.ts`
- Related native Element (manifest): [dialog](../elements/dialog.md)
- Note: True modal via show-modal/request-close; the browser owns inertness, Escape and focus return. Controlled/initially open state lives in @gunkin/uiify/components/modal/client. Trigger/Close built on @gunkin/uiify/elements/dialog. Backdrop tap and swipe-down are optional UIEnhance improvements; without them the modal still closes by icon, Escape and (Chrome/Firefox) backdrop tap.

## Related knowledge

- Recipe: [modal](../../../skills/uiify/references/elements/modal.md)

## Exports

- Runtime: `Modal`, `ModalBody`, `ModalClose`, `ModalContent`, `ModalDescription`, `ModalFooter`, `ModalGrabber`, `ModalHeader`, `ModalTitle`, `ModalTrigger`
- Types: `ModalAlign`, `ModalAppearanceProps`, `ModalBackdrop`, `ModalBodyProps`, `ModalCloseOwnProps`, `ModalCloseProps`, `ModalContentOwnProps`, `ModalContentProps`, `ModalDescriptionProps`, `ModalDismiss`, `ModalFooterProps`, `ModalGrabberProps`, `ModalHeaderProps`, `ModalProps`, `ModalLabels`, `ModalOwnProps`, `ModalSlotProps`, `ModalSize`, `ModalTitleProps`, `ModalTriggerOwnProps`, `ModalTriggerProps`

## Values

- `ModalSize`: `"sm" | "md" | "lg" | "full"`
- `ModalAlign`: `"center" | "start"`
- `ModalDismiss`: `"any" | "closerequest" | "none"`
- `ModalBackdrop`: `"opaque" | "blur" | "none"`

## Props and shapes

### ModalAppearanceProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `size` | `ModalSize \| undefined` | no | Width step; `full` fills the viewport. Default `md`. |
| `align` | `ModalAlign \| undefined` | no | Vertical position on tablet and desktop; phones get a bottom sheet unless `size` is `full`. Default `center`. |
| `dismiss` | `ModalDismiss \| undefined` | no | Native `closedby`: `any` also closes on a backdrop tap, `closerequest` on Escape only, `none` only through your own controls. Default `any`. Engines without `closedby` (Safari) ignore it: Escape still closes the dialog there, and `UIEnhance` honours it only for its own backdrop tap (`any` only) and sheet swipe (off for `none`). |
| `backdrop` | `ModalBackdrop \| undefined` | no | Backdrop treatment. Default `opaque`. |

### ModalOwnProps

Extends: `ModalAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `trigger` | `ReactNode` | yes |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `children` | `ReactNode` | no |  |
| `closeLabel` | `string` | no | Accessible name of the header close icon. |
| `labels` | `Partial<ModalLabels>` | no |  |
| `footer` | `ReactNode` | no | Actions row pinned under the body. |
| `slotProps` | `ModalSlotProps` | no | Native props for the elements created by this convenience component. |

### ModalSlotProps

Native props for Modal's generated inner elements. Owned ids and markers stay internal.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `ModalSlotElementProps<"button", \| "type" \| "command" \| "commandfor" \| "popoverTarget" \| "popoverTargetAction" \| "data-part" \| "data-uiify-modal" \| "data-uiify-button">` | no |  |
| `content` | `ModalSlotElementProps<"dialog", \| "id" \| "open" \| "popover" \| "closedby" \| "data-part" \| "data-uiify-modal" \| "aria-describedby" \| "aria-labelledby">` | no |  |
| `grabber` | `ModalSlotElementProps<"div", "data-part" \| "data-uiify-modal" \| "aria-hidden">` | no |  |
| `header` | `ModalSlotElementProps<"div", "data-part" \| "data-uiify-modal">` | no |  |
| `title` | `ModalSlotElementProps<"h2", "id" \| "data-part" \| "data-uiify-modal">` | no |  |
| `description` | `ModalSlotElementProps<"p", "id" \| "data-part" \| "data-uiify-modal">` | no |  |
| `close` | `ModalSlotElementProps<"button", \| "type" \| "command" \| "commandfor" \| "popoverTarget" \| "popoverTargetAction" \| "data-part" \| "data-uiify-modal" \| "data-uiify-button" \| "aria-label">` | no |  |
| `closeIcon` | `ModalSlotElementProps<"svg", "aria-hidden" \| "focusable">` | no |  |
| `closeIconPath` | `ModalSlotElementProps<"path">` | no |  |
| `body` | `ModalSlotElementProps<"div", "data-part" \| "data-uiify-modal">` | no |  |
| `footer` | `ModalSlotElementProps<"div", "data-part" \| "data-uiify-modal">` | no |  |

### ModalLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `close` | `string` | yes |  |

### ModalTriggerOwnProps

Own props of the native `show-modal` invoker.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `ModalContent` this button opens; the browser resolves it at click time. |

### ModalCloseOwnProps

Own props of the native `request-close` invoker.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `ModalContent` this button closes. |

### ModalContentOwnProps

Extends: `ModalAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |

### ModalClientContentOwnProps

Extends: `ModalAppearanceProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `defaultOpen` | `boolean` | no | Uncontrolled initial state, applied with `showModal()` after hydration; SSR markup stays closed. |
| `id` | `string` | yes |  |
| `onOpenChange` | `(open: boolean) => void` | no | Fires once per native or programmatic change with the state the element just entered. Also fires once at mount if the browser opened the dialog natively before hydration. Not reported: a pre-hydration open→close cycle that nets back to closed — the DOM retains no `toggle` history, so there is no evidence left that a transition happened at all. |
| `onOpenChangeComplete` | `(open: boolean) => void` | no | Fires once per open or close transition, after the dialog's CSS transitions have finished (immediately when there are none). This includes the transition that applies `defaultOpen` after hydration; it does not fire for a dialog that never changes state. |
| `open` | `boolean` | no | Controlled state, authoritative after hydration. |

## Other types

- `ModalProps`: `ModalOwnProps & Omit<ModalSlotElementProps<"div", "data-part" | "data-uiify-modal">, keyof ModalOwnProps>` — Native props for Modal's root div plus its dialog and trigger contract.
- `ModalTriggerProps<TAs>`: `NativeButtonProps<TAs, ModalTriggerOwnProps>`
- `ModalCloseProps<TAs>`: `NativeButtonProps<TAs, ModalCloseOwnProps>`
- `ModalContentProps`: `ModalContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof ModalContentOwnProps | "open" | "popover" | "closedby">` — A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract.
- `ModalClientContentProps`: `ModalClientContentOwnProps & Omit<ComponentPropsWithRef<"dialog">, keyof ModalClientContentOwnProps | "popover" | "closedby">` — Props of the client adapter; `popover` is excluded because the adapter is always modal.
- `ModalHeaderProps`: `ComponentPropsWithRef<"div">`
- `ModalTitleProps`: `ComponentPropsWithRef<"h2">`
- `ModalDescriptionProps`: `ComponentPropsWithRef<"p">`
- `ModalBodyProps`: `ComponentPropsWithRef<"div">`
- `ModalFooterProps`: `ComponentPropsWithRef<"div">`
- `ModalGrabberProps`: `Omit<ComponentPropsWithRef<"div">, "children">`

## Sub-entries

### `@gunkin/uiify/components/modal/client`

- Runtime: `ModalClientContent`
- Types: `ModalClientContentOwnProps`, `ModalClientContentProps`

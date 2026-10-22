<!-- Generated from the package source. Do not edit by hand. -->
# popup

- Import: `@gunkin/uiify/components/popup`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `[popover]+popovertarget`
- Without JavaScript: full
- Types file: `dist/components/popup.d.ts`
- Related native Element (manifest): [popover](../elements/popover.md)
- Note: Native parts anchor to their invoker (implicit anchor) and carry no aria-expanded; Chromium exposes expanded through the accessibility tree, other engines are unmeasured. The legacy Popup.Root compound keeps UIEnhance for its DOM attribute. Trigger/Content/Close built on @gunkin/uiify/elements/popover.

## Related knowledge

- Recipe: [popup](../../../skills/uiify/references/elements/popup.md)

## Exports

- Runtime: `Popup`, `PopupClose`, `PopupContent`, `PopupTrigger`
- Types: `AnchorAlign`, `AnchorSide`, `PopupCloseOwnProps`, `PopupCloseProps`, `PopupContentOwnProps`, `PopupContentProps`, `PopupMode`, `PopupRootCloseOwnProps`, `PopupRootCloseProps`, `PopupRootContentOwnProps`, `PopupRootContentProps`, `PopupRootOwnProps`, `PopupRootProps`, `PopupRootTriggerOwnProps`, `PopupRootTriggerProps`, `PopupSurfaceMode`, `PopupTriggerOwnProps`, `PopupTriggerProps`

## Values

- `PopupMode`: `"auto" | "manual" | "hint"` — Legacy compound modes; `hint` is not part of the native parts API.
- `PopupSurfaceMode`: `"auto" | "manual"` — Native parts surface modes — the cross-engine baseline.
- `AnchorSide`: `"top" | "right" | "bottom" | "left"`
- `AnchorAlign`: `"start" | "center" | "end"`
- `PopupPartName`: `"trigger" | "content" | "close"`

## Props and shapes

### PopupInjectedProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `__mode` | `PopupMode` | no |  |
| `__popupId` | `string` | no |  |

### PopupContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `mode` | `PopupMode` | yes |  |

### PopupRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `id` | `string` | yes | Stable id for the popover surface and invoker commands. Required. |
| `mode` | `PopupMode` | no |  |

### PopupRootProps

Extends: `PopupRootOwnProps`, `Omit<HTMLAttributes<HTMLDivElement>, keyof PopupRootOwnProps>`

No own members.

### PopupRootTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### PopupRootContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `side` | `AnchorSide` | no |  |

### PopupRootCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### PopupTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `PopupContent` this button toggles. |

### PopupCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `PopupContent` this button hides. |

### PopupContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |
| `mode` | `PopupSurfaceMode` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `PopupRootTriggerProps`: `PopupRootTriggerOwnProps & Omit<HTMLAttributes<HTMLButtonElement>, keyof PopupRootTriggerOwnProps>`
- `PopupTriggerInternalProps`: `PopupRootTriggerProps & PopupInjectedProps`
- `PopupRootContentProps`: `PopupRootContentOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof PopupRootContentOwnProps>`
- `PopupContentInternalProps`: `PopupRootContentProps & PopupInjectedProps`
- `PopupRootCloseProps`: `PopupRootCloseOwnProps & Omit<HTMLAttributes<HTMLButtonElement>, keyof PopupRootCloseOwnProps>`
- `PopupCloseInternalProps`: `PopupRootCloseProps & PopupInjectedProps`
- `PopupTriggerProps<TAs>`: `NativeButtonProps<TAs, PopupTriggerOwnProps>`
- `PopupCloseProps<TAs>`: `NativeButtonProps<TAs, PopupCloseOwnProps>`
- `PopupContentProps`: `PopupContentOwnProps & Omit<ComponentPropsWithRef<"div">, keyof PopupContentOwnProps | "popover">`

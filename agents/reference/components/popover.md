<!-- Generated from the package source. Do not edit by hand. -->
# popover

- Import: `@gunkin/uiify/components/popover`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `[popover]+popovertarget`
- Without JavaScript: full
- Types file: `dist/components/popover.d.ts`
- Related native Element (manifest): [native-popover](../elements/native-popover.md)
- Note: Native parts anchor to their invoker (implicit anchor) and carry no aria-expanded; Chromium exposes expanded through the accessibility tree, other engines are unmeasured. Exports PopoverTrigger/PopoverContent/PopoverClose only: the legacy id-injecting compound and its UIEnhance dependency are removed, and no Popover root exists because the parts share no state (they link by id/target).

## Related knowledge

- Recipe: [popover](../../../skills/uiify/references/elements/popover.md)

## Exports

- Runtime: `PopoverClose`, `PopoverContent`, `PopoverTrigger`
- Types: `AnchorAlign`, `AnchorSide`, `PopoverCloseOwnProps`, `PopoverCloseProps`, `PopoverContentOwnProps`, `PopoverContentProps`, `PopoverSurfaceMode`, `PopoverTriggerOwnProps`, `PopoverTriggerProps`

## Values

- `PopoverSurfaceMode`: `"auto" | "manual"` — Native parts surface modes — the cross-engine baseline.
- `AnchorSide`: `"top" | "right" | "bottom" | "left"`
- `AnchorAlign`: `"start" | "center" | "end"`

## Props and shapes

### PopoverTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `PopoverContent` this button toggles. |

### PopoverCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `PopoverContent` this button hides. |

### PopoverContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |
| `mode` | `PopoverSurfaceMode` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `PopoverTriggerProps<TAs>`: `NativeButtonProps<TAs, PopoverTriggerOwnProps>`
- `PopoverCloseProps<TAs>`: `NativeButtonProps<TAs, PopoverCloseOwnProps>`
- `PopoverContentProps`: `PopoverContentOwnProps & Omit<ComponentPropsWithRef<"div">, keyof PopoverContentOwnProps | "popover">`

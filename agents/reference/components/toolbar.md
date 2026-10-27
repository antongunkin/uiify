<!-- Generated from the package source. Do not edit by hand. -->
# toolbar

- Import: `@gunkin/uiify/components/toolbar`
- Tier 1 (RSC shell + thin client island); state source none; native element `div[role=toolbar]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/toolbar.d.ts`

## Related knowledge

- Recipe: [toolbar](../../../skills/uiify/references/elements/toolbar.md)

## Exports

- Runtime: `Toolbar`
- Types: `ToolbarButtonOwnProps`, `ToolbarButtonProps`, `ToolbarLinkOwnProps`, `ToolbarLinkProps`, `ToolbarRootOwnProps`, `ToolbarRootProps`, `ToolbarSeparatorOwnProps`, `ToolbarSeparatorProps`, `ToolbarToggleGroupProps`

## Props and shapes

### ToolbarRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `dir` | `Direction` | no |  |
| `loop` | `boolean` | no |  |
| `orientation` | `RovingFocusOrientation` | no |  |

### ToolbarRootProps

Extends: `ToolbarRootOwnProps`, `Omit<ComponentPropsWithRef<"div">, keyof ToolbarRootOwnProps>`

No own members.

### ToolbarButtonOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `selected` | `boolean` | no | Toggle state of the button: reported as aria-pressed and styled as selected. |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | no |  |

### ToolbarButtonProps

Extends: `ToolbarButtonOwnProps`, `Omit<ComponentPropsWithRef<"button">, keyof ToolbarButtonOwnProps | "disabled">`

No own members.

### ToolbarLinkOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `href` | `string` | yes |  |

### ToolbarLinkProps

Extends: `ToolbarLinkOwnProps`, `Omit<ComponentPropsWithRef<"a">, keyof ToolbarLinkOwnProps | "href">`

No own members.

### ToolbarSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `orientation` | `"horizontal" \| "vertical"` | no |  |

## Other types

- `ToolbarSeparatorProps`: `ToolbarSeparatorOwnProps & Omit<ComponentPropsWithRef<"hr">, keyof ToolbarSeparatorOwnProps>`
- `ToolbarToggleGroupProps`: `ToggleGroupProps`

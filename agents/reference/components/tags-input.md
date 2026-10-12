<!-- Generated from the package source. Do not edit by hand. -->
# tags-input

- Import: `@gunkin/uiify/components/tags-input`
- Tier 2 (Client component — pre-hydration SSR); state source none; native element `input`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/tags-input.d.ts`

## Exports

- Runtime: `TagsInput`, `TagsInputInput`, `TagsInputList`, `TagsInputRoot`, `TagsInputTag`, `TagsInputTagRemove`, `splitTags`
- Types: `TagsInputInputOwnProps`, `TagsInputInputProps`, `TagsInputRootControlledOwnProps`, `TagsInputRootShellOwnProps`, `TagsInputRootShellProps`, `TagsInputRootProps`, `TagsInputTagOwnProps`, `TagsInputTagProps`, `TagsInputStore`

## Props and shapes

### TagsInputStoreOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `allowDuplicates` | `boolean` | no |  |
| `maxTags` | `number` | no |  |
| `validate` | `(tag: string) => boolean` | no |  |

### TagsInputStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `addTag` | `(tag: string) => boolean` | yes |  |
| `addTags` | `(nextTags: readonly string[]) => void` | yes |  |
| `getTags` | `() => string[]` | yes |  |
| `removeAt` | `(index: number) => void` | yes |  |
| `removeLast` | `() => void` | yes |  |
| `setTags` | `(next: readonly string[]) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `updateOptions` | `(next: TagsInputStoreOptions) => void` | yes |  |

### TagsInputContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `addOnPaste` | `boolean` | yes |  |
| `addTag` | `(tag: string) => void` | yes |  |
| `delimiters` | `readonly string[]` | yes |  |
| `disabled` | `boolean` | yes |  |
| `inputId` | `string` | yes |  |
| `inputValue` | `string` | yes |  |
| `listId` | `string` | yes |  |
| `removeAt` | `(index: number) => void` | yes |  |
| `setInputValue` | `(value: string) => void` | yes |  |
| `store` | `TagsInputStore` | yes |  |

### TagsInputRootShellOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `addOnPaste` | `boolean` | no |  |
| `allowDuplicates` | `boolean` | no |  |
| `defaultValue` | `readonly string[]` | no |  |
| `delimiters` | `readonly string[]` | no |  |
| `disabled` | `boolean` | no |  |
| `id` | `string` | no |  |
| `items` | `readonly string[]` | no |  |
| `maxTags` | `number` | no |  |
| `validate` | `(tag: string) => boolean` | no |  |

### TagsInputRootControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onValueChange` | `(tags: string[]) => void` | no |  |
| `value` | `readonly string[]` | no |  |

### TagsInputRootShellProps

Extends: `TagsInputRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TagsInputRootProps

Extends: `TagsInputRootShellOwnProps`, `TagsInputRootControlledOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TagsInputInputOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `placeholder` | `string` | no |  |

### TagsInputListOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### TagsInputTagOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `index` | `number` | yes |  |
| `value` | `string` | yes |  |

### TagsInputTagRemoveOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `index` | `number` | yes |  |

## Other types

- `TagsInputInputProps<TAs>`: `RenderableProps<TAs, TagsInputInputOwnProps, { disabled: boolean }, HTMLInputElement>`
- `TagsInputTagProps<TAs>`: `RenderableProps<TAs, TagsInputTagOwnProps, { current: boolean }, HTMLElement>`

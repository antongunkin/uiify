<!-- Generated from the package source. Do not edit by hand. -->
# file-upload

- Import: `@gunkin/uiify/components/file-upload`
- Tier 1 (RSC shell + thin client island); state source S1; native element `input[type=file]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/file-upload.d.ts`

## Related knowledge

- Recipe: [file-upload](../../../skills/uiify/references/elements/file-upload.md)

## Exports

- Runtime: `FileUpload`, `FileUploadDropzone`, `FileUploadHiddenInput`, `FileUploadItem`, `FileUploadItemRemove`, `FileUploadList`, `FileUploadRoot`, `FileUploadTrigger`, `validateFiles`
- Types: `FileUploadDropzoneOwnProps`, `FileUploadDropzoneProps`, `FileUploadHiddenInputOwnProps`, `FileUploadLabels`, `FileUploadListOwnProps`, `FileUploadItemRemoveOwnProps`, `FileUploadItemOwnProps`, `FileUploadItemProps`, `FileUploadRootOwnProps`, `FileUploadRootProps`, `FileUploadTriggerOwnProps`, `FileUploadTriggerProps`, `FileRejection`, `FileUploadStore`

## Props and shapes

### FileRejection

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | `File` | yes |  |
| `reason` | `"accept" \| "max-size" \| "max-files"` | yes |  |

### FileUploadLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `dropzone` | `string` | yes |  |
| `remove` | `string` | yes |  |
| `removeFallback` | `string` | yes |  |

### FileUploadStoreOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `accept` | `readonly string[]` | no |  |
| `maxFiles` | `number` | no |  |
| `maxSize` | `number` | no |  |
| `minSize` | `number` | no |  |
| `multiple` | `boolean` | no |  |

### FileUploadStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `addFiles` | `(next: readonly File[]) => void` | yes |  |
| `clear` | `() => void` | yes |  |
| `getFiles` | `() => File[]` | yes |  |
| `removeAt` | `(index: number) => void` | yes |  |
| `setFiles` | `(next: readonly File[]) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |

### FileUploadContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `accept` | `readonly string[]` | yes |  |
| `disabled` | `boolean` | yes |  |
| `hiddenInputRef` | `RefObject<HTMLInputElement \| null>` | yes |  |
| `inputId` | `string` | yes |  |
| `multiple` | `boolean` | yes |  |
| `openPicker` | `() => void` | yes |  |
| `processFiles` | `(list: FileList \| readonly File[]) => void` | yes |  |
| `removeAt` | `(index: number) => void` | yes |  |
| `reset` | `() => void` | yes |  |
| `files` | `readonly File[]` | yes |  |
| `labels` | `FileUploadLabels` | yes |  |
| `removeLabel` | `string` | no |  |

### FileUploadRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `accept` | `readonly string[]` | no |  |
| `defaultValue` | `readonly File[]` | no |  |
| `disabled` | `boolean` | no |  |
| `maxFiles` | `number` | no |  |
| `maxSize` | `number` | no |  |
| `labels` | `Partial<FileUploadLabels>` | no |  |
| `minSize` | `number` | no |  |
| `multiple` | `boolean` | no |  |
| `onValueChange` | `(files: File[]) => void` | no |  |
| `onReject` | `(rejections: FileRejection[]) => void` | no |  |
| `value` | `readonly File[]` | no |  |

### FileUploadRootProps

Extends: `FileUploadRootOwnProps`, `Omit<ComponentPropsWithRef<"div">, keyof FileUploadRootOwnProps | "defaultValue">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### FileUploadHiddenInputOwnProps

Extends: `Omit<ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "accept" | "multiple" | "disabled">`

No own members.

### FileUploadTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### FileUploadDropzoneOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### FileUploadListOwnProps

Extends: `Omit<ComponentPropsWithRef<"ul">, "children">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode \| ((files: readonly File[]) => ReactNode)` | no |  |

### FileUploadItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `index` | `number` | yes |  |

### FileUploadItemRemoveOwnProps

Extends: `ComponentPropsWithRef<"button">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |

## Other types

- `FileUploadTriggerProps<TAs>`: `RenderableProps<TAs, FileUploadTriggerOwnProps, { disabled: boolean }, HTMLElement>`
- `FileUploadDropzoneProps<TAs>`: `RenderableProps<TAs, FileUploadDropzoneOwnProps, { disabled: boolean }, HTMLElement>`
- `FileUploadItemProps<TAs>`: `RenderableProps<TAs, FileUploadItemOwnProps, { index: number }, HTMLElement>`

"use client";
import { useRef, type ReactElement } from "react";
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import { FileUploadProvider } from "./file-upload-context.js";
import { validateFiles } from "./file-upload-store.js";
import type { FileUploadRootProps } from "./types.js";

export function FileUploadRootClient({
  accept = [],
  children,
  defaultValue = [],
  disabled = false,
  maxFiles,
  maxSize,
  minSize,
  multiple = false,
  onValueChange,
  onReject,
  value,
  ...consumerProps
}: FileUploadRootProps): ReactElement {
  const inputId = useId();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useControllableState<readonly File[]>({
    value,
    defaultValue,
    onChange: (next) => onValueChange?.([...next]),
  });
  const processFiles = (list: FileList | readonly File[]) => {
    if (disabled) return;
    const { accepted, rejected } = validateFiles(Array.from(list), {
      accept,
      multiple,
      ...(maxFiles === undefined
        ? {}
        : { maxFiles: multiple ? Math.max(0, maxFiles - files.length) : maxFiles }),
      ...(maxSize === undefined ? {} : { maxSize }),
      ...(minSize === undefined ? {} : { minSize }),
    });
    if (rejected.length) onReject?.(rejected);
    if (accepted.length) setFiles(multiple ? [...files, ...accepted] : accepted);
  };
  return (
    <div {...consumerProps} data-uiify-file-upload="" data-disabled={disabled ? "" : undefined}>
      <FileUploadProvider
        value={{
          accept,
          disabled,
          files,
          hiddenInputRef,
          inputId,
          multiple,
          processFiles,
          reset: () => setFiles([]),
          openPicker: () => {
            if (!disabled) hiddenInputRef.current?.click();
          },
          removeAt: (index) => {
            if (!disabled && index >= 0 && index < files.length)
              setFiles(files.filter((_, i) => i !== index));
          },
        }}
      >
        {children}
      </FileUploadProvider>
    </div>
  );
}
FileUploadRootClient.displayName = "FileUploadRootClient";
export const FileUploadRoot = FileUploadRootClient;

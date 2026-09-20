import type { ElementType, ReactNode, RefObject } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface FileRejection {
  readonly file: File;
  readonly reason: "accept" | "max-size" | "max-files";
}

export interface FileUploadStoreOptions {
  readonly accept?: readonly string[];
  readonly maxFiles?: number;
  readonly maxSize?: number;
  readonly minSize?: number;
  readonly multiple?: boolean;
}

export interface FileUploadStore {
  readonly addFiles: (next: readonly File[]) => void;
  readonly clear: () => void;
  readonly getFiles: () => File[];
  readonly removeAt: (index: number) => void;
  readonly setFiles: (next: readonly File[]) => void;
  readonly subscribe: (listener: () => void) => () => void;
}

export interface FileUploadContextValue {
  readonly accept: readonly string[];
  readonly disabled: boolean;
  readonly hiddenInputRef: RefObject<HTMLInputElement | null>;
  readonly inputId: string;
  readonly multiple: boolean;
  readonly openPicker: () => void;
  readonly processFiles: (list: FileList | readonly File[]) => void;
  readonly removeAt: (index: number) => void;
  readonly store: FileUploadStore;
}

export interface FileUploadRootOwnProps {
  readonly accept?: readonly string[];
  readonly defaultValue?: readonly File[];
  readonly disabled?: boolean;
  readonly maxFiles?: number;
  readonly maxSize?: number;
  readonly minSize?: number;
  readonly multiple?: boolean;
  readonly onChange?: (files: File[]) => void;
  readonly onReject?: (rejections: FileRejection[]) => void;
  readonly value?: readonly File[];
}

export interface FileUploadRootProps extends FileUploadRootOwnProps {
  readonly children?: ReactNode;
}

export interface FileUploadHiddenInputOwnProps {
  readonly className?: string;
}

export interface FileUploadTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type FileUploadTriggerProps<TAs extends ElementType = "label"> = RenderableProps<
  TAs,
  FileUploadTriggerOwnProps,
  { disabled: boolean },
  HTMLElement
>;

export interface FileUploadDropzoneOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type FileUploadDropzoneProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  FileUploadDropzoneOwnProps,
  { disabled: boolean },
  HTMLElement
>;

export interface FileUploadListOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface FileUploadItemOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly index: number;
}

export type FileUploadItemProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  FileUploadItemOwnProps,
  { index: number },
  HTMLElement
>;

export interface FileUploadItemRemoveOwnProps {
  readonly className?: string;
  readonly index: number;
}

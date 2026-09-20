"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import type { ElementType, DragEvent, ReactElement, SyntheticEvent } from "react";
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { createFileUploadStore, validateFiles } from "./file-upload-store.js";
import type {
  FileUploadStore,
  FileUploadContextValue,
  FileUploadRootProps,
  FileUploadHiddenInputOwnProps,
  FileUploadTriggerProps,
  FileUploadDropzoneProps,
  FileUploadListOwnProps,
  FileUploadItemProps,
  FileUploadItemRemoveOwnProps,
} from "./types.js";

const [FileUploadProvider, useFileUploadContext] =
  createPartContext<FileUploadContextValue>("FileUpload");

export function FileUploadRootClient(props: FileUploadRootProps): ReactElement | null {
  const {
    accept = [],
    children,
    defaultValue = [],
    disabled = false,
    maxFiles,
    maxSize,
    minSize,
    multiple = false,
    onChange,
    onReject,
    value: controlledValue,
  } = props;

  const inputId = useId();
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useControllableState<File[]>({
    defaultValue: [...defaultValue],
    ...(controlledValue !== undefined ? { value: [...controlledValue] } : {}),
    ...(onChange ? { onChange } : {}),
  });

  const storeRef = useRef<FileUploadStore | null>(null);
  storeRef.current ??= createFileUploadStore(files);
  const store = storeRef.current;

  const processFiles = useCallback(
    (list: FileList | readonly File[]) => {
      if (disabled) return;
      const incoming = Array.from(list);
      const { accepted, rejected } = validateFiles(incoming, {
        accept,
        multiple,
        ...(maxFiles !== undefined ? { maxFiles } : {}),
        ...(maxSize !== undefined ? { maxSize } : {}),
        ...(minSize !== undefined ? { minSize } : {}),
      });
      if (rejected.length > 0) onReject?.(rejected);
      if (accepted.length === 0) return;
      const next = multiple ? [...store.getFiles(), ...accepted] : accepted;
      store.setFiles(next);
      setFiles(next);
    },
    [accept, disabled, maxFiles, maxSize, minSize, multiple, onReject, setFiles, store],
  );

  const openPicker = useCallback(() => {
    hiddenInputRef.current?.click();
  }, []);

  const removeAt = useCallback(
    (index: number) => {
      store.removeAt(index);
      setFiles(store.getFiles());
    },
    [setFiles, store],
  );

  const contextValue = useMemo(
    () => ({
      accept,
      disabled,
      hiddenInputRef,
      inputId,
      multiple,
      openPicker,
      processFiles,
      removeAt,
      store,
    }),
    [accept, disabled, inputId, multiple, openPicker, processFiles, removeAt, store],
  );

  return <FileUploadProvider value={contextValue}>{children}</FileUploadProvider>;
}
FileUploadRootClient.displayName = "FileUploadRootClient";

export const FileUploadRoot = FileUploadRootClient;

export function FileUploadHiddenInput(props: FileUploadHiddenInputOwnProps): ReactElement | null {
  const { className } = props;
  const { accept, disabled, hiddenInputRef, inputId, multiple, processFiles } =
    useFileUploadContext("HiddenInput");

  return useRenderElement({
    defaultTag: "input",
    props: {
      ref: hiddenInputRef,
      id: inputId,
      type: "file",
      tabIndex: -1,
      accept: accept.length > 0 ? accept.join(",") : undefined,
      multiple: multiple || undefined,
      style: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px",
      },
      disabled: disabled || undefined,
      ...(className ? { className } : {}),
      onChange(event: SyntheticEvent<HTMLInputElement>) {
        const list = event.currentTarget.files;
        if (list) processFiles(list);
        event.currentTarget.value = "";
      },
    },
    state: { disabled },
  });
}

export function FileUploadTrigger<TAs extends ElementType = "label">(
  props: FileUploadTriggerProps<TAs>,
): ReactElement | null {
  const { as, render, className, children, ...consumerProps } =
    props as FileUploadTriggerProps<ElementType>;
  const { disabled, inputId, openPicker } = useFileUploadContext("Trigger");
  const tag = typeof as === "string" ? as : undefined;
  const { onClick: consumerOnClick } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
  };
  const interactiveProps =
    tag === "button"
      ? {
          type: "button" as const,
          "aria-controls": inputId,
          disabled: disabled || undefined,
          onClick: composeEventHandlers(consumerOnClick, openPicker),
        }
      : {
          htmlFor: inputId,
          "aria-controls": inputId,
        };

  return useRenderElement({
    as,
    defaultTag: "label",
    props: {
      ...consumerProps,
      ...interactiveProps,
      ...(className ? { className } : {}),
      children,
    },
    render,
    state: { disabled },
  });
}

export function FileUploadDropzone<TAs extends ElementType = "div">(
  props: FileUploadDropzoneProps<TAs>,
): ReactElement | null {
  const { as, render, className, children, ...consumerProps } =
    props as FileUploadDropzoneProps<"div">;
  const { disabled, processFiles } = useFileUploadContext("Dropzone");
  const { onDragOver: consumerOnDragOver, onDrop: consumerOnDrop } = consumerProps as {
    onDragOver?: (event: DragEvent<HTMLElement>) => void;
    onDrop?: (event: DragEvent<HTMLElement>) => void;
  };

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      role: "region",
      "aria-label": "Drop files here",
      "data-disabled": disabled ? "" : undefined,
      onDragOver: composeEventHandlers(consumerOnDragOver, (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
      }),
      onDrop: composeEventHandlers(consumerOnDrop, (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        if (disabled) return;
        processFiles(event.dataTransfer.files);
      }),
      ...(className ? { className } : {}),
      children,
    },
    render,
    state: { disabled },
  });
}

export function FileUploadList(props: FileUploadListOwnProps): ReactElement | null {
  const { children, className } = props;
  return useRenderElement({
    defaultTag: "ul",
    props: { role: "list", ...(className ? { className } : {}), children },
    state: {},
  });
}

export function FileUploadItem<TAs extends ElementType = "li">(
  props: FileUploadItemProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, index, ...consumerProps } =
    props as FileUploadItemProps<"li">;
  const { store } = useFileUploadContext("Item");
  const files = useSyncExternalStore(store.subscribe, store.getFiles, store.getFiles);
  const file = files[index];

  const element = useRenderElement({
    as,
    defaultTag: "li",
    props: {
      ...consumerProps,
      role: "listitem",
      "data-name": file?.name,
      ...(className ? { className } : {}),
      children: children ?? file?.name,
    },
    render,
    state: { index },
  });

  if (!file) return null;
  return element;
}

export function FileUploadItemRemove(props: FileUploadItemRemoveOwnProps): ReactElement | null {
  const { className, index } = props;
  const { disabled, removeAt } = useFileUploadContext("ItemRemove");

  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      "aria-label": "Remove file",
      disabled: disabled || undefined,
      ...(className ? { className } : {}),
      onClick: () => removeAt(index),
    },
    state: { disabled },
  });
}

export const FileUpload = {
  Dropzone: FileUploadDropzone,
  HiddenInput: FileUploadHiddenInput,
  Item: FileUploadItem,
  ItemRemove: FileUploadItemRemove,
  List: FileUploadList,
  Root: FileUploadRoot,
  Trigger: FileUploadTrigger,
};

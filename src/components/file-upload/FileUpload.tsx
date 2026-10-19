"use client";

import type { ElementType, DragEvent, ReactElement, SyntheticEvent } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { FileUploadRoot, FileUploadRootClient } from "./FileUploadRoot.js";
import { FileUploadHiddenInput } from "./FileUploadInput.js";
import { useFileUploadContext } from "./file-upload-context.js";
import type {
  FileUploadTriggerProps,
  FileUploadDropzoneProps,
  FileUploadListOwnProps,
  FileUploadItemProps,
  FileUploadItemRemoveOwnProps,
} from "./types.js";
export { FileUploadRoot, FileUploadRootClient, FileUploadHiddenInput };

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
          "data-uiify-button": "",
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
      "data-part": "trigger",
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
  const { disabled, labels, processFiles } = useFileUploadContext("Dropzone");
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
      "data-part": "dropzone",
      "aria-label": labels.dropzone,
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
  const { children, ...consumerProps } = props;
  const { files } = useFileUploadContext("List");
  return useRenderElement({
    defaultTag: "ul",
    props: {
      ...consumerProps,
      role: "list",
      "data-part": "list",
      children: typeof children === "function" ? children(files) : children,
    },
    state: {},
  });
}

export function FileUploadItem<TAs extends ElementType = "li">(
  props: FileUploadItemProps<TAs>,
): ReactElement | null {
  const { as, render, children, className, index, ...consumerProps } =
    props as FileUploadItemProps<"li">;
  const { files } = useFileUploadContext("Item");
  const file = files[index];

  const element = useRenderElement({
    as,
    defaultTag: "li",
    props: {
      ...consumerProps,
      role: "listitem",
      "data-part": "item",
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
  const {
    index,
    onClick,
    disabled: consumerDisabled = false,
    children = "×",
    ...consumerProps
  } = props;
  const {
    disabled: rootDisabled,
    files,
    labels,
    removeAt,
    removeLabel,
  } = useFileUploadContext("ItemRemove");

  const disabled = rootDisabled || consumerDisabled;
  return useRenderElement({
    defaultTag: "button",
    props: {
      type: "button",
      ...consumerProps,
      "aria-label":
        consumerProps["aria-label"] ??
        (removeLabel !== undefined
          ? formatLabel(removeLabel, { name: files[index]?.name ?? "" })
          : labels.removeFallback),
      children,
      "data-part": "remove",
      disabled: disabled || undefined,
      onClick: composeEventHandlers(onClick, () => {
        if (!disabled) removeAt(index);
      }),
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

"use client";
import { useEffect } from "react";
import type { ReactElement } from "react";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useFileUploadContext } from "./file-upload-context.js";
import type { FileUploadHiddenInputOwnProps } from "./types.js";

export function FileUploadHiddenInput({
  ref,
  onChange,
  onClick,
  ...consumerProps
}: FileUploadHiddenInputOwnProps): ReactElement {
  const { accept, disabled, hiddenInputRef, inputId, multiple, processFiles, files, reset } =
    useFileUploadContext("HiddenInput");
  const mergedRef = useMergedRefs(ref, hiddenInputRef);
  const syncFiles = () => {
    // DOM-less consumers do not provide a native file-list constructor.
    if (typeof DataTransfer === "undefined" || !hiddenInputRef.current) return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    hiddenInputRef.current.files = transfer.files;
  };
  useEffect(() => {
    syncFiles();
    const input = hiddenInputRef.current;
    input?.addEventListener("cancel", syncFiles);
    return () => input?.removeEventListener("cancel", syncFiles);
  }, [files, hiddenInputRef]);
  useEffect(() => {
    const form = hiddenInputRef.current?.form;
    if (!form) return;
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [hiddenInputRef, reset]);
  return (
    <input
      {...consumerProps}
      ref={mergedRef}
      id={inputId}
      type="file"
      data-part="input"
      accept={accept.length ? accept.join(",") : undefined}
      disabled={disabled}
      multiple={multiple}
      onClick={composeEventHandlers(onClick, (event) => {
        // Clearing immediately before the picker makes same-file selection emit change.
        event.currentTarget.value = "";
      })}
      onChange={(event) => {
        composeEventHandlers(onChange, (change) => {
          if (change.currentTarget.files) processFiles(change.currentTarget.files);
        })(event);
        // Restore authoritative files even if every picked file was rejected or vetoed.
        syncFiles();
      }}
    />
  );
}
FileUploadHiddenInput.displayName = "FileUploadHiddenInput";

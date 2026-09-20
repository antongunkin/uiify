"use client";

import { useRef } from "react";
import type { DialogHTMLAttributes, RefCallback, SyntheticEvent } from "react";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import type { OpenChangeReason } from "./open-change-details.js";
import { supportsDialogRequestClose } from "./platform.js";
import {
  useControllableOpenChange,
  type UseControllableOpenChangeOptions,
} from "./use-controllable-open-change.js";

export type DialogChangeHandler = UseControllableOpenChangeOptions["onOpenChange"];

export interface UseDialogOptions extends UseControllableOpenChangeOptions {
  readonly modal?: boolean;
}

export interface UseDialogReturn {
  readonly close: (returnValue?: string) => void;
  readonly dialogProps: DialogHTMLAttributes<HTMLDialogElement>;
  readonly dialogRef: RefCallback<HTMLDialogElement>;
  readonly open: boolean;
  readonly openDialog: () => void;
  readonly returnValue: string;
}

export function useDialog({
  defaultOpen = false,
  modal = true,
  onOpenChange,
  open: controlledOpen,
}: UseDialogOptions = {}): UseDialogReturn {
  const { open, requestChange } = useControllableOpenChange({
    defaultOpen,
    onOpenChange,
    open: controlledOpen,
  });
  const elementRef = useRef<HTMLDialogElement | null>(null);
  const pendingCloseReasonRef = useRef<OpenChangeReason | null>(null);
  const returnValueRef = useRef("");
  const suppressCloseSyncRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const dialog = elementRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (modal) dialog.showModal();
      else dialog.show();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [modal, open]);

  return {
    close(returnValue = "") {
      const dialog = elementRef.current;
      if (!dialog) {
        requestChange(false, "programmatic");
        return;
      }
      returnValueRef.current = returnValue;
      if (supportsDialogRequestClose()) {
        pendingCloseReasonRef.current = "programmatic";
        (
          dialog as HTMLDialogElement & {
            requestClose(value?: string): void;
          }
        ).requestClose(returnValue);
      } else if (requestChange(false, "programmatic")) {
        suppressCloseSyncRef.current = true;
        dialog.close(returnValue);
      }
    },
    dialogProps: {
      onCancel(event: SyntheticEvent<HTMLDialogElement>) {
        event.preventDefault();
        const reason = pendingCloseReasonRef.current ?? "escape-key";
        pendingCloseReasonRef.current = null;
        const allowed = requestChange(false, reason, event.nativeEvent);
        if (allowed) {
          const dialog = event.currentTarget;
          suppressCloseSyncRef.current = true;
          dialog.close();
        }
      },
      onClose(event: SyntheticEvent<HTMLDialogElement>) {
        returnValueRef.current = event.currentTarget.returnValue;
        if (suppressCloseSyncRef.current) {
          suppressCloseSyncRef.current = false;
          return;
        }
        if (open) requestChange(false, "native-toggle", event.nativeEvent);
      },
    },
    dialogRef(element) {
      elementRef.current = element;
    },
    open,
    openDialog() {
      requestChange(true, "trigger-press");
    },
    get returnValue() {
      return returnValueRef.current;
    },
  };
}

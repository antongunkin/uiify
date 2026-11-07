"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { useControllableState, useEventCallback, useId, useMergedRefs } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { isComposingKeyEvent } from "@gunkin/uiify/core/ime";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { PolymorphicProps } from "@gunkin/uiify/core/render";
import type {
  InputOTPType,
  InputOTPContextValue,
  InputOTPProps,
  InputOTPSlotProps,
  InputOTPHiddenInputProps,
} from "./types.js";

const [InputOTPProvider, useOtpInputContext] = createPartContext<InputOTPContextValue>("InputOTP");

function sanitizeValue(raw: string, type: InputOTPType, maxLength: number): string {
  const pattern = type === "numeric" ? /\d/g : /[a-zA-Z0-9]/g;
  return (raw.match(pattern) ?? []).join("").slice(0, maxLength);
}

export function InputOTP<TAs extends ElementType = "div">(
  props: InputOTPProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    length = 6,
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    onComplete,
    type = "numeric",
    mask = false,
    disabled = false,
    autoFocus = false,
    size,
    ...consumerProps
  } = props as InputOTPProps<ElementType>;

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useControllableState<string>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  const updateValue = useCallback(
    (nextRaw: string) => {
      const next = sanitizeValue(nextRaw, type, length);
      setValue(next);
      if (next.length === length) onComplete?.(next);
    },
    [length, onComplete, setValue, type],
  );

  const { onClick: consumerOnClick } = consumerProps as {
    onClick?: (event: SyntheticEvent<HTMLElement>) => void;
  };

  const handleClick = useEventCallback(() => hiddenInputRef.current?.focus());

  const activeIndex = focused ? Math.min(value.length, length - 1) : -1;
  const contextValue = useMemo<InputOTPContextValue>(
    () => ({
      activeIndex,
      autoFocus,
      disabled,
      hiddenInputRef,
      length,
      mask,
      onHiddenBlur: () => setFocused(false),
      onHiddenFocus: () => setFocused(true),
      type,
      updateValue,
      value,
    }),
    [activeIndex, autoFocus, disabled, length, mask, type, updateValue, value],
  );

  const element = useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...(size !== undefined ? { "data-size": size } : {}),
      "data-disabled": disabled ? "" : undefined,
      "data-complete": value.length === length ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-input-otp", consumerProps.className),
      onClick: composeEventHandlers(consumerOnClick, handleClick),
    },
    render,
    state: { disabled, mask, type },
  });

  return <InputOTPProvider value={contextValue}>{element}</InputOTPProvider>;
}
InputOTP.displayName = "InputOTP";

export function InputOTPSlot<TAs extends ElementType = "div">(
  props: InputOTPSlotProps<TAs>,
): ReactElement | null {
  const { as, render, index, ...consumerProps } = props as InputOTPSlotProps<ElementType>;
  const { activeIndex, disabled, length, mask, value } = useOtpInputContext("Slot");

  if (index < 0 || index >= length) {
    throw new Error(`InputOTPSlot index ${index} is out of range for length ${length}`);
  }

  const char = value[index] ?? "";
  const active = activeIndex === index;
  const filled = char !== "";

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      "aria-hidden": true,
      "data-active": active ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-filled": filled ? "" : undefined,
      "data-index": index,
      ...consumerProps,
      className: cn("uiify-input-otp-slot", consumerProps.className),
      children: mask && filled ? "•" : char,
    },
    render,
    state: { active, filled },
  });
}

export function InputOTPHiddenInput<TAs extends ElementType = "input">(
  props: InputOTPHiddenInputProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    ref: consumerRef,
    style: consumerStyle,
    ...consumerProps
  } = props as PolymorphicProps<"input", { readonly autoFocus?: boolean | undefined }>;

  const {
    autoFocus: rootAutoFocus,
    disabled,
    hiddenInputRef,
    length,
    mask,
    onHiddenBlur,
    onHiddenFocus,
    type,
    updateValue,
    value,
  } = useOtpInputContext("HiddenInput");
  const mergedRef = useMergedRefs(consumerRef, hiddenInputRef);
  const inputId = useId();
  const {
    onBlur: consumerOnBlur,
    onChange: consumerOnChange,
    onFocus: consumerOnFocus,
    onKeyDown: consumerOnKeyDown,
    onPaste: consumerOnPaste,
  } = consumerProps as {
    onBlur?: (event: SyntheticEvent<HTMLInputElement>) => void;
    onChange?: (event: SyntheticEvent<HTMLInputElement>) => void;
    onFocus?: (event: SyntheticEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  };

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    updateValue(event.currentTarget.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isComposingKeyEvent(event)) return;
    if (event.key === "Backspace" && value.length > 0) {
      event.preventDefault();
      updateValue(value.slice(0, -1));
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateValue(event.clipboardData.getData("text"));
  };

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      id: inputId,
      type: mask ? "password" : "text",
      inputMode: type === "numeric" ? "numeric" : "text",
      autoComplete: "one-time-code",
      autoFocus: rootAutoFocus || undefined,
      disabled: disabled || undefined,
      "aria-label": "One-time code",
      value,
      maxLength: length,
      ...consumerProps,
      className: cn("uiify-input-otp-control", consumerProps.className),
      ref: mergedRef,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      onFocus: composeEventHandlers(consumerOnFocus, onHiddenFocus),
      onBlur: composeEventHandlers(consumerOnBlur, onHiddenBlur),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      onPaste: composeEventHandlers(consumerOnPaste, handlePaste),
      style: {
        position: "absolute",
        opacity: 0,
        pointerEvents: "none",
        width: 1,
        height: 1,
        ...consumerStyle,
      } as CSSProperties,
    },
    render,
    state: { disabled },
  });
}

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
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { PolymorphicProps } from "@gunkin/uiify/core/render";
import type {
  OtpInputType,
  OtpInputContextValue,
  OtpInputRootProps,
  OtpInputSlotProps,
  OtpInputHiddenInputProps,
} from "./types.js";

const [OtpInputProvider, useOtpInputContext] = createPartContext<OtpInputContextValue>("OtpInput");

function sanitizeValue(raw: string, type: OtpInputType, maxLength: number): string {
  const pattern = type === "numeric" ? /\d/g : /[a-zA-Z0-9]/g;
  return (raw.match(pattern) ?? []).join("").slice(0, maxLength);
}

export function OtpInputRoot<TAs extends ElementType = "div">(
  props: OtpInputRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    length = 6,
    value: controlledValue,
    defaultValue = "",
    onChange,
    onComplete,
    type = "numeric",
    mask = false,
    disabled = false,
    autoFocus = false,
    ...consumerProps
  } = props as OtpInputRootProps<ElementType>;

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useControllableState<string>({
    value: controlledValue,
    defaultValue,
    onChange,
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

  const handleClick = () => hiddenInputRef.current?.focus();

  const activeIndex = focused ? Math.min(value.length, length - 1) : -1;
  const contextValue = useMemo<OtpInputContextValue>(
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
      ...consumerProps,
      "data-uiify-otp-input": "",
      "data-disabled": disabled ? "" : undefined,
      "data-complete": value.length === length ? "" : undefined,
      onClick: composeEventHandlers(consumerOnClick, handleClick),
    },
    render,
    state: { disabled, mask, type },
  });

  return <OtpInputProvider value={contextValue}>{element}</OtpInputProvider>;
}
OtpInputRoot.displayName = "OtpInputRoot";

export function OtpInputSlot<TAs extends ElementType = "div">(
  props: OtpInputSlotProps<TAs>,
): ReactElement | null {
  const { as, render, index, ...consumerProps } = props as OtpInputSlotProps<ElementType>;
  const { activeIndex, disabled, length, mask, value } = useOtpInputContext("Slot");

  if (index < 0 || index >= length) {
    throw new Error(`OtpInput.Slot index ${index} is out of range for length ${length}`);
  }

  const char = value[index] ?? "";
  const active = activeIndex === index;
  const filled = char !== "";

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "aria-hidden": true,
      "data-part": "slot",
      "data-active": active ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-filled": filled ? "" : undefined,
      "data-index": index,
      children: mask && filled ? "•" : char,
    },
    render,
    state: { active, filled },
  });
}

export function OtpInputHiddenInput<TAs extends ElementType = "input">(
  props: OtpInputHiddenInputProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    autoFocus: autoFocusProp,
    style: consumerStyle,
    ...consumerProps
  } = props as PolymorphicProps<"input", { readonly autoFocus?: boolean }>;

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
  const inputId = useId();
  const autoFocus = autoFocusProp ?? rootAutoFocus;
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
      ...consumerProps,
      "data-part": "control",
      id: inputId,
      ref: hiddenInputRef,
      type: mask ? "password" : "text",
      inputMode: type === "numeric" ? "numeric" : "text",
      autoComplete: "one-time-code",
      autoFocus: autoFocus || undefined,
      disabled: disabled || undefined,
      "aria-label": "One-time code",
      value,
      maxLength: length,
      onChange: composeEventHandlers(consumerOnChange, handleChange),
      onFocus: composeEventHandlers(consumerOnFocus, onHiddenFocus),
      onBlur: composeEventHandlers(consumerOnBlur, onHiddenBlur),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, handleKeyDown),
      onPaste: composeEventHandlers(consumerOnPaste, handlePaste),
      style: {
        ...consumerStyle,
        position: "absolute",
        opacity: 0,
        pointerEvents: "none",
        width: 1,
        height: 1,
      } as CSSProperties,
    },
    render,
    state: { disabled },
  });
}

export const OtpInput = {
  Root: OtpInputRoot,
  Slot: OtpInputSlot,
  HiddenInput: OtpInputHiddenInput,
};

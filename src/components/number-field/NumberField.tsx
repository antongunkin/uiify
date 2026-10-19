"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { isComposingKeyEvent } from "@gunkin/uiify/core/ime";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement, type PolymorphicProps } from "@gunkin/uiify/core/render";
import {
  clampNumber,
  createFormatter,
  formatNumber,
  isNumberInput,
  parseNumber,
  stepNumber,
} from "./format.js";
import { usePressRepeat } from "./use-press-repeat.js";
import type {
  NumberFieldContextValue,
  NumberFieldRootProps,
  NumberFieldGroupProps,
  NumberFieldInputProps,
  NumberFieldIncrementProps,
  NumberFieldDecrementProps,
} from "./types.js";

export type {
  NumberFieldDecrementProps,
  NumberFieldGroupProps,
  NumberFieldIncrementProps,
  NumberFieldInputOwnProps,
  NumberFieldInputProps,
  NumberFieldRootOwnProps,
  NumberFieldRootProps,
} from "./types.js";

const [NumberFieldProvider, useNumberFieldContext] =
  createPartContext<NumberFieldContextValue>("NumberField");

export function NumberFieldRoot<TAs extends ElementType = "div">(
  props: NumberFieldRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    value: controlledValue,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    formatOptions,
    locale = "en-US",
    clampValueOnBlur = true,
    disabled = false,
    readOnly = false,
    required = false,
    ...consumerProps
  } = props as NumberFieldRootProps<ElementType>;

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const formatter = useMemo(() => createFormatter(locale, formatOptions), [locale, formatOptions]);
  const [value, setValue] = useControllableState<number | undefined>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState(() =>
    value === undefined ? "" : formatNumber(value, formatter),
  );

  const syncDisplay = useCallback(
    (next: number | undefined) => {
      setDisplayValue(next === undefined ? "" : formatNumber(next, formatter));
    },
    [formatter],
  );

  const applyValue = useCallback(
    (next: number | undefined) => {
      const clamped =
        next === undefined ? undefined : clampValueOnBlur ? clampNumber(next, min, max) : next;
      setValue(clamped);
      syncDisplay(clamped);
    },
    [clampValueOnBlur, max, min, setValue, syncDisplay],
  );

  const increment = useCallback(
    (multiplier = 1) => {
      if (disabled || readOnly) return;
      const base = value ?? min ?? 0;
      applyValue(stepNumber(base, multiplier, step, min, max));
    },
    [applyValue, disabled, max, min, readOnly, step, value],
  );

  const decrement = useCallback(
    (multiplier = 1) => {
      increment(-multiplier);
    },
    [increment],
  );

  const commitInput = useCallback(
    (raw: string) => {
      const parsed = parseNumber(raw, formatter);
      if (parsed === undefined) {
        syncDisplay(value);
        return;
      }
      applyValue(parsed);
    },
    [applyValue, formatter, syncDisplay, value],
  );

  const contextValue = useMemo<NumberFieldContextValue>(
    () => ({
      clampValueOnBlur,
      commitInput,
      decrement,
      disabled,
      displayValue: editing
        ? displayValue
        : value === undefined
          ? ""
          : formatNumber(value, formatter),
      formatter,
      increment,
      inputId,
      inputRef,
      max,
      min,
      numericValue: value,
      readOnly,
      required,
      setDisplayValue,
      setEditing,
      step,
    }),
    [
      clampValueOnBlur,
      commitInput,
      decrement,
      disabled,
      displayValue,
      editing,
      formatter,
      increment,
      inputId,
      max,
      min,
      readOnly,
      required,
      step,
      value,
    ],
  );

  const element = useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-disabled": disabled ? "" : undefined,
      "data-uiify-number-field": "",
    },
    render,
    state: { disabled, readOnly, required },
  });

  return <NumberFieldProvider value={contextValue}>{element}</NumberFieldProvider>;
}
NumberFieldRoot.displayName = "NumberFieldRoot";

export function NumberFieldGroup<TAs extends ElementType = "div">(
  props: NumberFieldGroupProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as NumberFieldGroupProps<ElementType>;
  const { disabled } = useNumberFieldContext("Group");

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-disabled": disabled ? "" : undefined,
      "data-part": "group",
    },
    render,
    state: { disabled },
  });
}

export function NumberFieldInput<TAs extends ElementType = "input">(
  props: NumberFieldInputProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as NumberFieldInputProps<"input">;
  const {
    commitInput,
    decrement,
    disabled,
    displayValue,
    formatter,
    increment,
    inputId,
    inputRef,
    max,
    min,
    numericValue,
    readOnly,
    required,
    setDisplayValue,
    setEditing,
  } = useNumberFieldContext("Input");

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isComposingKeyEvent(event)) return;
    if (disabled || readOnly) return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        increment();
        break;
      case "ArrowDown":
        event.preventDefault();
        decrement();
        break;
      case "PageUp":
        event.preventDefault();
        increment(10);
        break;
      case "PageDown":
        event.preventDefault();
        decrement(10);
        break;
      case "Home":
        event.preventDefault();
        if (min !== undefined) commitInput(String(min));
        break;
      case "End":
        event.preventDefault();
        if (max !== undefined) commitInput(String(max));
        break;
      default:
        break;
    }
  };

  return useRenderElement({
    as,
    defaultTag: "input",
    props: {
      ...consumerProps,
      id: consumerProps.id ?? inputId,
      ref: inputRef,
      role: "spinbutton",
      "data-part": "input",
      inputMode: "decimal",
      "aria-valuenow": numericValue,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-required": required || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      disabled: disabled || undefined,
      readOnly: readOnly || undefined,
      required: required || undefined,
      value: displayValue,
      onFocus: composeEventHandlers(consumerProps.onFocus, () => setEditing(true)),
      onBlur: composeEventHandlers(consumerProps.onBlur, (event: FocusEvent<HTMLInputElement>) => {
        setEditing(false);
        commitInput(event.currentTarget.value);
      }),
      onChange: composeEventHandlers(
        consumerProps.onChange,
        (event: SyntheticEvent<HTMLInputElement>) => {
          if (isNumberInput(event.currentTarget.value, formatter))
            setDisplayValue(event.currentTarget.value);
        },
      ),
      onKeyDown: composeEventHandlers(consumerProps.onKeyDown, onKeyDown),
    },
    render,
    state: { disabled, readOnly, required },
  });
}

export function NumberFieldIncrement<TAs extends ElementType = "button">(
  props: NumberFieldIncrementProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as PolymorphicProps<
    "button",
    { readonly children?: ReactNode }
  >;
  const { disabled, increment, readOnly } = useNumberFieldContext("Increment");
  const inactive = disabled || readOnly;
  const repeatProps = usePressRepeat(() => increment(), inactive);

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      tabIndex: -1,
      "data-part": "increment",
      "data-disabled": inactive ? "" : undefined,
      disabled: inactive || undefined,
      onClick: composeEventHandlers(
        consumerProps.onClick,
        (event: ReactMouseEvent<HTMLButtonElement>) => {
          if (event.detail === 0) increment();
        },
      ),
      onPointerDown: composeEventHandlers(consumerProps.onPointerDown, repeatProps.onPointerDown),
      onPointerUp: composeEventHandlers(consumerProps.onPointerUp, repeatProps.onPointerUp),
      onPointerLeave: composeEventHandlers(
        consumerProps.onPointerLeave,
        repeatProps.onPointerLeave,
      ),
      onPointerCancel: composeEventHandlers(
        consumerProps.onPointerCancel,
        repeatProps.onPointerCancel,
      ),
    },
    render,
    state: { disabled: inactive },
  });
}

export function NumberFieldDecrement<TAs extends ElementType = "button">(
  props: NumberFieldDecrementProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as PolymorphicProps<
    "button",
    { readonly children?: ReactNode }
  >;
  const { decrement, disabled, readOnly } = useNumberFieldContext("Decrement");
  const inactive = disabled || readOnly;
  const repeatProps = usePressRepeat(() => decrement(), inactive);

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      type: "button",
      tabIndex: -1,
      "data-part": "decrement",
      "data-disabled": inactive ? "" : undefined,
      disabled: inactive || undefined,
      onClick: composeEventHandlers(
        consumerProps.onClick,
        (event: ReactMouseEvent<HTMLButtonElement>) => {
          if (event.detail === 0) decrement();
        },
      ),
      onPointerDown: composeEventHandlers(consumerProps.onPointerDown, repeatProps.onPointerDown),
      onPointerUp: composeEventHandlers(consumerProps.onPointerUp, repeatProps.onPointerUp),
      onPointerLeave: composeEventHandlers(
        consumerProps.onPointerLeave,
        repeatProps.onPointerLeave,
      ),
      onPointerCancel: composeEventHandlers(
        consumerProps.onPointerCancel,
        repeatProps.onPointerCancel,
      ),
    },
    render,
    state: { disabled: inactive },
  });
}

export const NumberField = {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
};

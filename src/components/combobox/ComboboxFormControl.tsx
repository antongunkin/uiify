"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import { useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { useComboboxContext } from "./combobox-context.js";
import type { ComboboxFormControlProps } from "./types.js";

export function ComboboxFormControl(props: ComboboxFormControlProps): ReactElement {
  const { ref, disabled: consumerDisabled, onInvalid, required = false, ...consumerProps } = props;
  const context = useComboboxContext("FormControl");
  const { disabled: rootDisabled, inputNode, registerFormControl, setFormState } = context;
  const disabled = consumerDisabled ?? rootDisabled;
  const values = context.multiple
    ? context.selectedValues
    : typeof context.value === "string"
      ? [context.value]
      : [];
  const [node, setNode] = useState<HTMLSelectElement | null>(null);
  const mergedRef = useMergedRefs(ref, setNode);
  const [attempted, setAttempted] = useState(false);
  const current = useRef({ context, values });
  useIsomorphicLayoutEffect(() => {
    current.current = { context, values };
  });
  const treeRoot = node?.getRootNode();

  useIsomorphicLayoutEffect(() => {
    if (!node || !treeRoot) return undefined;
    let mounted = true;
    const handleReset = (event: Event) => {
      const owner = node.form;
      if (!owner || event.target !== owner) return;
      const settle = () => {
        if (!mounted || event.defaultPrevented || owner !== node.form) return;
        // Trusted native events can run a microtask checkpoint between capture and bubble.
        // Wait until every reset listener has had the chance to cancel the default action.
        if (event.eventPhase !== Event.NONE) {
          setTimeout(settle, 0);
          return;
        }
        flushSync(() => {
          current.current.context.reset();
          setAttempted(false);
        });
        if (!mounted || node.getRootNode() !== treeRoot) return;
        // Read committed owner props after the flush: controlled owners may accept or refuse.
        // Native reset can clear selectedness without changing any controlled React prop.
        const selected = new Set(current.current.values);
        for (const option of node.options) option.selected = selected.has(option.value);
      };
      queueMicrotask(settle);
    };
    treeRoot.addEventListener("reset", handleReset, true);
    return () => {
      mounted = false;
      treeRoot.removeEventListener("reset", handleReset, true);
    };
  }, [node, treeRoot]);

  useIsomorphicLayoutEffect(() => {
    if (!node) return undefined;
    return registerFormControl(node);
  }, [node, registerFormControl]);

  useIsomorphicLayoutEffect(() => {
    if (!node) return;
    const invalid = !node.validity.valid;
    if (!invalid || !required || disabled) setAttempted(false);
    setFormState({ required: required && !disabled, invalid: attempted && invalid && !disabled });
  }, [attempted, disabled, node, required, setFormState, values]);

  return (
    <select
      hidden
      tabIndex={-1}
      aria-hidden="true"
      disabled={disabled}
      required={required}
      {...consumerProps}
      className={cn("uiify-combobox-form-control", consumerProps.className)}
      multiple
      value={values}
      ref={mergedRef}
      onChange={() => {}}
      onInvalid={(event) => {
        onInvalid?.(event);
        const focusCanceled = event.defaultPrevented;
        // Keep native submit blocking, but prevent the browser focusing a hidden proxy.
        event.preventDefault();
        setAttempted(true);
        if (!focusCanceled) inputNode?.focus({ preventScroll: true });
      }}
    >
      {values.map((value) => (
        <option key={value} value={value}>
          {context.getValueLabel(value)}
        </option>
      ))}
    </select>
  );
}
ComboboxFormControl.displayName = "ComboboxFormControl";

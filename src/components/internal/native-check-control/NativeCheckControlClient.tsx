"use client";

import { useEffect, useRef } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useMergedRefs } from "@gunkin/uiify/hooks";
import { NativeCheckControl } from "./NativeCheckControl.js";
import type { NativeCheckControlClientProps, NativeCheckControlSlotProps } from "./types.js";

/**
 * Client-only wrapper that makes a mixed checkbox real: it sets the DOM `indeterminate`
 * property and supplies the matching `aria-checked`/`data-state` defaults. The properties are
 * merged before the consumer input slot, so consumer values still win.
 */
export function NativeCheckControlClient(props: NativeCheckControlClientProps): ReactElement {
  const { checked, onCheckedChange, slotProps, ...rest } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedRef = useMergedRefs(inputRef, rest.ref, slotProps?.input?.ref);
  const isMixed = checked === "indeterminate";

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = isMixed;
  }, [isMixed]);

  const reassertIndeterminate = (event: ChangeEvent<HTMLInputElement>) => {
    if (isMixed) event.currentTarget.indeterminate = true;
  };
  const consumerOnChange = slotProps?.input?.onChange;
  const handleInputChange = consumerOnChange
    ? composeEventHandlers<ChangeEvent<HTMLInputElement>>(consumerOnChange, reassertIndeterminate)
    : reassertIndeterminate;

  const inputSlot: NonNullable<NativeCheckControlSlotProps["input"]> = {
    ...(isMixed ? { "aria-checked": "mixed", "data-state": "indeterminate" } : {}),
    ...slotProps?.input,
    ref: mergedRef,
    onChange: handleInputChange,
  };
  const resolvedSlotProps: NativeCheckControlSlotProps = {
    ...slotProps,
    input: inputSlot,
  };

  return (
    <NativeCheckControl
      {...rest}
      {...(checked !== undefined ? { checked: checked === true } : {})}
      {...(onCheckedChange !== undefined ? { onCheckedChange } : {})}
      slotProps={resolvedSlotProps}
    />
  );
}
NativeCheckControlClient.displayName = "NativeCheckControlClient";

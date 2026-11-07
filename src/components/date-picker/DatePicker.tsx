import type { ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import type { DatePickerProps } from "./types.js";

export function DatePicker({ invalid = false, size, ...props }: DatePickerProps): ReactElement {
  return (
    <input
      {...props}
      type="date"
      data-size={size}
      data-disabled={props.disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid ? true : props["aria-invalid"]}
      className={cn("uiify-date-picker", props.className)}
    />
  );
}

DatePicker.displayName = "DatePicker";

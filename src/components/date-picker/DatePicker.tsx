import type { ReactElement } from "react";
import type { DatePickerProps } from "./types.js";

export function DatePicker({ invalid = false, ...props }: DatePickerProps): ReactElement {
  return (
    <input
      {...props}
      type="date"
      data-uiify-date-picker=""
      data-disabled={props.disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid ? true : props["aria-invalid"]}
    />
  );
}

DatePicker.displayName = "DatePicker";

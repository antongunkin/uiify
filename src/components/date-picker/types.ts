import type { ComponentPropsWithRef } from "react";
import type { ControlSize } from "../internal/control-size/types.js";

export interface DatePickerProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size"> {
  readonly invalid?: boolean;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
}

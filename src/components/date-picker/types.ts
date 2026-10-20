import type { ComponentPropsWithRef } from "react";

export interface DatePickerProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  readonly invalid?: boolean;
}

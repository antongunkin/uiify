// API informed by shadcn/ui public documentation (names and props only).
import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { RadioGroupItemProps } from "./types.js";

/** A bare native radio: the browser owns selection, arrow keys and form submission. */
export function RadioGroupItem(props: RadioGroupItemProps): ReactElement {
  const { className, ...consumerProps } = props;
  return (
    <input type="radio" {...consumerProps} className={cn("uiify-radio-group-control", className)} />
  );
}
RadioGroupItem.displayName = "RadioGroupItem";

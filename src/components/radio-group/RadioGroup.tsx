// API informed by shadcn/ui public documentation (names and props only).
import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { RadioGroupProps } from "./types.js";

export function RadioGroup({
  orientation = "vertical",
  className,
  children,
  ...consumerProps
}: RadioGroupProps): ReactElement {
  return (
    <div
      role="radiogroup"
      data-orientation={orientation}
      {...consumerProps}
      className={cn("uiify-radio-group", className)}
    >
      {children}
    </div>
  );
}
RadioGroup.displayName = "RadioGroup";

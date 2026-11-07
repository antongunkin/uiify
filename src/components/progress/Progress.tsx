import { createElement } from "react";
import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { ProgressProps } from "./types.js";

export function Progress(props: ProgressProps): ReactElement {
  return createElement("progress", {
    ...props,
    className: cn("uiify-progress", props.className),
  });
}

Progress.displayName = "Progress";

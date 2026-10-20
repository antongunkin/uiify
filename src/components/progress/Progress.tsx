import { createElement } from "react";
import type { ReactElement } from "react";
import type { ProgressProps } from "./types.js";

export function Progress(props: ProgressProps): ReactElement {
  return createElement("progress", { ...props, "data-uiify-progress": "" });
}

Progress.displayName = "Progress";

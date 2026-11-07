// API informed by shadcn/ui public documentation (names and props only).
import type { ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { SeparatorProps } from "./types.js";

export function Separator(props: SeparatorProps): ReactElement | null {
  const { orientation = "horizontal", ...consumerProps } = props;
  return useRenderElement({
    defaultTag: "hr",
    props: {
      "data-orientation": orientation,
      "aria-orientation": orientation === "vertical" ? "vertical" : undefined,
      ...consumerProps,
      className: cn("uiify-separator", consumerProps.className),
    },
    state: {},
  });
}

Separator.displayName = "Separator";

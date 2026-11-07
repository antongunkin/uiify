import { createElement } from "react";
import { cn } from "../../core/class-names.js";
import type { ElementType, ReactElement } from "react";
import type { PopoverCloseProps, PopoverContentProps, PopoverTriggerProps } from "./types.js";

/** Native popover trigger with popup identity and trigger anatomy. */
export function PopoverTrigger<TAs extends ElementType = "button">(
  props: PopoverTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopoverTriggerProps<"button">;
  return createElement(as ?? "button", {
    ...consumerProps,
    className: cn("uiify-button", "uiify-popover-trigger", consumerProps.className),
    popoverTarget: target,
    popoverTargetAction: "toggle",
    type: "button",
  });
}
PopoverTrigger.displayName = "PopoverTrigger";

/** Native popover surface with popup identity and content anatomy. */
export function PopoverContent(props: PopoverContentProps): ReactElement {
  const { align = "center", children, mode = "auto", side = "bottom", ...consumerProps } = props;
  return createElement(
    "div",
    {
      "data-align": align,
      "data-positioning": "native",
      "data-side": side,
      popover: mode,
      ...consumerProps,
      className: cn("uiify-popover-content", consumerProps.className),
    },
    children,
  );
}
PopoverContent.displayName = "PopoverContent";

/** Native popover close invoker. */
export function PopoverClose<TAs extends ElementType = "button">(
  props: PopoverCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopoverCloseProps<"button">;
  return createElement(as ?? "button", {
    ...consumerProps,
    className: cn("uiify-button", "uiify-popover-close", consumerProps.className),
    popoverTarget: target,
    popoverTargetAction: "hide",
    type: "button",
  });
}
PopoverClose.displayName = "PopoverClose";

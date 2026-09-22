import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import type { PopupCloseProps, PopupContentProps, PopupTriggerProps } from "./types.js";

/** Native popover trigger with popup identity and trigger anatomy. */
export function PopupTrigger<TAs extends ElementType = "button">(
  props: PopupTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopupTriggerProps<"button">;
  return createElement(as ?? "button", {
    ...consumerProps,
    "data-part": "trigger",
    "data-uiify-popup": "",
    popoverTarget: target,
    popoverTargetAction: "toggle",
    type: "button",
  });
}
PopupTrigger.displayName = "PopupTrigger";

/** Native popover surface with popup identity and content anatomy. */
export function PopupContent(props: PopupContentProps): ReactElement {
  const { align = "center", children, mode = "auto", side = "bottom", ...consumerProps } = props;
  return createElement(
    "div",
    {
      ...consumerProps,
      "data-align": align,
      "data-part": "content",
      "data-positioning": "native",
      "data-side": side,
      "data-uiify-popup": "",
      popover: mode,
    },
    children,
  );
}
PopupContent.displayName = "PopupContent";

/** Native popover close invoker. */
export function PopupClose<TAs extends ElementType = "button">(
  props: PopupCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopupCloseProps<"button">;
  return createElement(as ?? "button", {
    ...consumerProps,
    "data-part": "close",
    "data-uiify-popup": "",
    popoverTarget: target,
    popoverTargetAction: "hide",
    type: "button",
  });
}
PopupClose.displayName = "PopupClose";

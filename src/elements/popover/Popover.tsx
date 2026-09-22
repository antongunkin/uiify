import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import type {
  PopoverCloseProps,
  PopoverSurfaceProps,
  PopoverTriggerAction,
  PopoverTriggerProps,
} from "./types.js";

/**
 * Render a `popovertarget` invoker. React 19 knows `popoverTarget` and
 * `popoverTargetAction` as camelCase DOM properties: on the client it sets them via
 * `setAttribute`, which the browser lowercases automatically for an HTML element, and any
 * HTML parser (including hydration) lowercases attribute names from source regardless of
 * case — so the resulting DOM attribute is always `popovertarget`/`popovertargetaction`.
 * React's SSR string renderer has no case-mapping for these two (unlike `className` or
 * `htmlFor`) and serializes the literal camelCase spelling into the markup string; that is
 * a cosmetic detail of the raw SSR string, not a behavioral gap, since a real parser
 * normalizes it.
 *
 * `createElement` rather than JSX for the same reason as `elements/invoker`/`elements/dialog`:
 * `as` is typed as the generic `ElementType`, so a plain object survives type-checking where
 * a literal JSX attribute list on a polymorphic tag would not.
 */
function renderInvoker(
  as: ElementType | undefined,
  marker: string,
  part: string,
  action: PopoverTriggerAction,
  target: string,
  consumerProps: Record<string, unknown>,
): ReactElement {
  return createElement(as ?? "button", {
    ...consumerProps,
    [marker]: "",
    "data-part": part,
    popoverTarget: target,
    popoverTargetAction: action,
    type: "button",
  });
}

/**
 * Acts on `target` (`action`, default `"toggle"`); light dismiss, Escape and nesting are
 * handled by the browser. The popover opened this way uses the invoker as its implicit
 * anchor, so no anchor name is emitted. Emits `data-uiify-popover` with
 * `data-part="trigger"`.
 */
function popoverTrigger<TAs extends ElementType = "button">(
  props: PopoverTriggerProps<TAs>,
): ReactElement {
  const {
    action = "toggle",
    as,
    target,
    ...consumerProps
  } = props as PopoverTriggerProps<"button">;
  return renderInvoker(
    as,
    "data-uiify-popover",
    "trigger",
    action,
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const PopoverTrigger = /* @__PURE__ */ Object.assign(popoverTrigger, {
  displayName: "PopoverTrigger",
});

/**
 * The popover surface. `data-side`/`data-align` drive required geometry in
 * `@gunkin/uiify/components/behavior.css`; optional skins provide the gap. Emits `popover`, `data-side`, `data-align`, `data-positioning="native"` and
 * `data-uiify-popover` with `data-part="surface"`.
 */
function popoverSurface(props: PopoverSurfaceProps): ReactElement {
  const { align = "center", children, mode = "auto", side = "bottom", ...consumerProps } = props;
  return (
    <div
      {...consumerProps}
      data-align={align}
      data-part="surface"
      data-positioning="native"
      data-side={side}
      data-uiify-popover=""
      popover={mode}
    >
      {children}
    </div>
  );
}
export const PopoverSurface = /* @__PURE__ */ Object.assign(popoverSurface, {
  displayName: "PopoverSurface",
});

/**
 * Hides `target`. Emits `data-uiify-popover` with `data-part="close"`.
 */
function popoverClose<TAs extends ElementType = "button">(
  props: PopoverCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopoverCloseProps<"button">;
  return renderInvoker(
    as,
    "data-uiify-popover",
    "close",
    "hide",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const PopoverClose = /* @__PURE__ */ Object.assign(popoverClose, {
  displayName: "PopoverClose",
});

export const Popover = {
  Trigger: PopoverTrigger,
  Surface: PopoverSurface,
  Close: PopoverClose,
};

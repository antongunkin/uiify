import { createElement } from "react";
import type { ElementType, ReactElement } from "react";
import { cn } from "@gunkin/uiify/core/render";
import type {
  NativePopoverCloseProps,
  NativePopoverSurfaceProps,
  NativePopoverTriggerAction,
  NativePopoverTriggerProps,
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
  className: string,
  action: NativePopoverTriggerAction,
  target: string,
  consumerProps: Record<string, unknown>,
): ReactElement {
  return createElement(as ?? "button", {
    popoverTarget: target,
    popoverTargetAction: action,
    type: "button",
    ...consumerProps,
    className: cn(className, consumerProps.className as string | undefined),
  });
}
/**
 * Acts on `target` (`action`, default `"toggle"`); light dismiss, Escape and nesting are
 * handled by the browser. The popover opened this way uses the invoker as its implicit
 * anchor, so no anchor name is emitted. Renders the `uiify-native-popover-trigger` class.
 */
function popoverTrigger<TAs extends ElementType = "button">(
  props: NativePopoverTriggerProps<TAs>,
): ReactElement {
  const {
    action = "toggle",
    as,
    target,
    ...consumerProps
  } = props as NativePopoverTriggerProps<"button">;
  return renderInvoker(
    as,
    "uiify-native-popover-trigger",
    action,
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const NativePopoverTrigger = /* @__PURE__ */ Object.assign(popoverTrigger, {
  displayName: "NativePopoverTrigger",
});
/**
 * The popover surface. `data-side`/`data-align` drive required geometry in
 * `@gunkin/uiify/components/behavior.css`; optional skins provide the gap. Emits `popover`,
 * `data-side`, `data-align`, `data-positioning="native"` and the `uiify-native-popover-surface` class.
 */
function popoverSurface(props: NativePopoverSurfaceProps): ReactElement {
  const {
    align = "center",
    children,
    className,
    mode = "auto",
    side = "bottom",
    ...consumerProps
  } = props;
  return (
    <div
      data-align={align}
      data-positioning="native"
      data-side={side}
      popover={mode}
      {...consumerProps}
      className={cn("uiify-native-popover-surface", className)}
    >
      {children}
    </div>
  );
}
export const NativePopoverSurface = /* @__PURE__ */ Object.assign(popoverSurface, {
  displayName: "NativePopoverSurface",
});
/**
 * Hides `target`. Renders the `uiify-native-popover-close` class.
 */
function popoverClose<TAs extends ElementType = "button">(
  props: NativePopoverCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as NativePopoverCloseProps<"button">;
  return renderInvoker(
    as,
    "uiify-native-popover-close",
    "hide",
    target,
    consumerProps as Record<string, unknown>,
  );
}
export const NativePopoverClose = /* @__PURE__ */ Object.assign(popoverClose, {
  displayName: "NativePopoverClose",
});
export const NativePopover = {
  Trigger: NativePopoverTrigger,
  Surface: NativePopoverSurface,
  Close: NativePopoverClose,
};

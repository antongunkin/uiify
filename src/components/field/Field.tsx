import { cn } from "../../core/class-names.js";
import type { ElementType, ReactElement, ReactNode } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type {
  FieldContentProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldProps,
  FieldSeparatorProps,
  FieldTitleProps,
} from "./types.js";

const hasContent = (children: ReactNode) =>
  children !== undefined && children !== null && children !== false;

/** Content that renders something: `""`, `true` and empty arrays render nothing. */
const rendersContent = (children: ReactNode): boolean =>
  Array.isArray(children)
    ? children.some(rendersContent)
    : hasContent(children) && children !== "" && children !== true;

export function FieldLabel(props: FieldLabelProps): ReactElement | null {
  const { className, children, disabled = false, required = false, ...consumerProps } = props;

  // The consumer's htmlFor names the control.
  return useRenderElement({
    defaultTag: "label",
    props: {
      "data-disabled": disabled ? "" : undefined,
      "data-required": required ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-field-label", className),
      children,
    },
    state: { disabled, required },
  });
}

export function FieldDescription(props: FieldDescriptionProps): ReactElement | null {
  const { className, children, disabled = false, ...consumerProps } = props;

  return useRenderElement({
    defaultTag: "p",
    props: {
      "data-disabled": disabled ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-field-description", className),
      children,
    },
    state: { disabled },
  });
}

export function FieldError(props: FieldErrorProps): ReactElement | null {
  const { className, children, ...consumerProps } = props;
  // Rendered only with content: the consumer passes the message for an invalid value.
  const shown = rendersContent(children);

  const element = useRenderElement({
    defaultTag: "p",
    props: {
      role: "alert",
      "data-invalid": "",
      ...consumerProps,
      className: cn("uiify-field-error", className),
      children,
    },
    state: { invalid: shown },
  });

  if (!shown) return null;

  return element;
}

// API informed by shadcn/ui public documentation (names and props only).
export function FieldContent<TAs extends ElementType = "div">(
  props: FieldContentProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as FieldContentProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, className: cn("uiify-field-content", consumerProps.className) },
    render,
    state: {},
  });
}

// API informed by shadcn/ui public documentation (names and props only).
export function FieldTitle<TAs extends ElementType = "div">(
  props: FieldTitleProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as FieldTitleProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, className: cn("uiify-field-title", consumerProps.className) },
    render,
    state: {},
  });
}

// API informed by shadcn/ui public documentation (names and props only).
export function FieldGroup<TAs extends ElementType = "div">(
  props: FieldGroupProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as FieldGroupProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, className: cn("uiify-field-group", consumerProps.className) },
    render,
    state: {},
  });
}

// API informed by shadcn/ui public documentation (names and props only).
// oxlint-disable-next-line react/display-name -- set in the PURE Object.assign below, so bundles can drop it
function FieldSeparatorComponent(props: FieldSeparatorProps): ReactElement | null {
  const { children, slotProps, ...consumerProps } = props;
  const content = hasContent(children);
  const lineProps = slotProps?.line;
  const contentProps = slotProps?.content;
  const line = (
    <hr
      role={content ? "none" : undefined}
      {...lineProps}
      className={cn("uiify-field-separator-line", lineProps?.className)}
    />
  );
  return useRenderElement({
    defaultTag: "div",
    props: {
      "data-content": content ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-field-separator", consumerProps.className),
      children: content ? (
        <>
          {line}
          <span
            {...contentProps}
            className={cn("uiify-field-separator-content", contentProps?.className)}
          >
            {children}
          </span>
          {line}
        </>
      ) : (
        line
      ),
    },
    state: {},
  });
}

/** displayName is set inside the PURE call: a top-level assignment would keep the separator in
 * every bundle that imports this module. */
export const FieldSeparator = /* @__PURE__ */ Object.assign(FieldSeparatorComponent, {
  displayName: "FieldSeparator",
});

// API informed by shadcn/ui public documentation (names and props only).
export function Field(props: FieldProps): ReactElement | null {
  const { orientation = "vertical", invalid = false, variant, ...consumerProps } = props;
  return useRenderElement({
    defaultTag: "div",
    props: {
      role: "group",
      "data-orientation": orientation,
      "data-invalid": invalid ? "" : undefined,
      "data-variant": variant,
      ...consumerProps,
      className: cn("uiify-field", consumerProps.className),
    },
    state: { orientation, invalid },
  });
}

import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { getFieldIds } from "./field-ids.js";
import type {
  FieldRootProps,
  FieldControlProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
} from "./types.js";

export function FieldRoot<TAs extends ElementType = "div">(
  props: FieldRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    id,
    invalid = false,
    required = false,
    disabled = false,
    // Accepted for API compatibility but not rendered — a bare `name` isn't
    // meaningful on the wrapper element itself, only on the actual control.
    name: _name,
    ...consumerProps
  } = props as FieldRootProps<ElementType>;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-disabled": disabled ? "" : undefined,
      "data-invalid": invalid ? "" : undefined,
      "data-required": required ? "" : undefined,
      "data-uiify-field": "",
      id,
    },
    render,
    state: { disabled, invalid, required, id },
  });
}

export function FieldLabel(props: FieldLabelProps): ReactElement | null {
  const {
    className,
    children,
    fieldId,
    disabled = false,
    required = false,
    ...consumerProps
  } = props;
  const { controlId, labelId } = getFieldIds(fieldId);

  return useRenderElement({
    defaultTag: "label",
    props: {
      ...consumerProps,
      id: labelId,
      htmlFor: controlId,
      "data-part": "label",
      "data-disabled": disabled ? "" : undefined,
      "data-required": required ? "" : undefined,
      ...(className ? { className } : {}),
      children,
    },
    state: { disabled, required },
  });
}

export function FieldControl<TAs extends ElementType = "div">(
  props: FieldControlProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    fieldId,
    disabled = false,
    invalid = false,
    required = false,
    ...consumerProps
  } = props as FieldControlProps<ElementType>;
  const { controlId, descriptionId, errorId, labelId } = getFieldIds(fieldId);
  const describedBy = [descriptionId, invalid ? errorId : undefined].filter(Boolean).join(" ");
  const controlIdentity =
    as === "input"
      ? { "data-uiify-input": "" }
      : as === "textarea"
        ? { "data-uiify-textarea": "" }
        : {};

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      ...controlIdentity,
      id: controlId,
      "data-part": "control",
      "aria-labelledby": labelId,
      "aria-describedby": describedBy || undefined,
      "aria-invalid": invalid || undefined,
      "aria-required": required || undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-invalid": invalid ? "" : undefined,
      "data-required": required ? "" : undefined,
    },
    render,
    state: { disabled, invalid, required },
  });
}

export function FieldDescription(props: FieldDescriptionProps): ReactElement | null {
  const { className, children, fieldId, disabled = false, ...consumerProps } = props;
  const { descriptionId } = getFieldIds(fieldId);

  return useRenderElement({
    defaultTag: "p",
    props: {
      ...consumerProps,
      id: descriptionId,
      "data-part": "description",
      "data-disabled": disabled ? "" : undefined,
      ...(className ? { className } : {}),
      children,
    },
    state: { disabled },
  });
}

export function FieldError(props: FieldErrorProps): ReactElement | null {
  const { className, children, fieldId, invalid = false, ...consumerProps } = props;
  const { errorId } = getFieldIds(fieldId);

  const element = useRenderElement({
    defaultTag: "p",
    props: {
      ...consumerProps,
      id: errorId,
      "data-part": "error",
      role: "alert",
      "data-invalid": "",
      ...(className ? { className } : {}),
      children,
    },
    state: { invalid },
  });

  if (!invalid) return null;

  return element;
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
};

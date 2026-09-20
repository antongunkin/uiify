import type { ElementType, FormHTMLAttributes, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { FormOwnProps, FormProps } from "./types.js";

export function Form<TAs extends ElementType = "form">(props: FormProps<TAs>): ReactElement | null {
  const {
    as,
    render,
    validationBehavior = "native",
    noValidate,
    ...consumerProps
  } = props as FormOwnProps &
    FormHTMLAttributes<HTMLFormElement> & {
      as?: ElementType;
      render?: (props: Record<string, unknown>, state: FormOwnProps) => ReactElement | null;
    };

  return useRenderElement({
    as,
    defaultTag: "form",
    props: {
      ...consumerProps,
      noValidate: validationBehavior === "aria" ? true : noValidate,
      "data-validation-behavior": validationBehavior,
    },
    render,
    state: { validationBehavior },
  });
}

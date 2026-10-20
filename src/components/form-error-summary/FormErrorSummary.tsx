import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { FormErrorSummaryProps } from "./types.js";

export function FormErrorSummary<TAs extends ElementType = "section">(
  props: FormErrorSummaryProps<TAs>,
): ReactElement | null {
  const { as, render, title, errors, ...consumerProps } = props as FormErrorSummaryProps<"section">;

  const element = useRenderElement({
    as,
    defaultTag: "section",
    props: {
      ...consumerProps,
      children: (
        <>
          <h2 data-part="title">{title}</h2>
          <ul data-part="list">
            {errors.map((error, index) => (
              <li data-part="item" key={`${error.href}-${index}`}>
                <a data-part="link" href={error.href}>
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
      "data-uiify-form-error-summary": "",
    },
    render,
    state: {},
  });

  return errors.length === 0 ? null : element;
}

FormErrorSummary.displayName = "FormErrorSummary";

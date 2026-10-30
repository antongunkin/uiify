import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import type { FormErrorSummaryProps } from "./types.js";

export function FormErrorSummary<TAs extends ElementType = "section">(
  props: FormErrorSummaryProps<TAs>,
): ReactElement | null {
  const { as, render, title, errors, slotProps, ...consumerProps } =
    props as FormErrorSummaryProps<"section">;

  const element = useRenderElement({
    as,
    defaultTag: "section",
    props: {
      "data-uiify-form-error-summary": "",
      ...consumerProps,
      children: (
        <>
          <h2 data-part="title" {...slotProps?.title}>
            {title}
          </h2>
          <ul data-part="list" {...slotProps?.list}>
            {errors.map((error, index) => (
              <li
                data-part="item"
                {...resolveRepeatedSlotProps(slotProps?.item, error.href)}
                key={`${error.href}-${index}`}
              >
                <a
                  data-part="link"
                  href={error.href}
                  {...resolveRepeatedSlotProps(slotProps?.link, error.href)}
                >
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    render,
    state: {},
  });

  return errors.length === 0 ? null : element;
}

FormErrorSummary.displayName = "FormErrorSummary";

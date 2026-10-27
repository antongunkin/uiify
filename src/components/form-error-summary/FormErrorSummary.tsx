import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { omitProps, resolveRepeatedSlotProps } from "../../core/slot-props.js";
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
      ...consumerProps,
      children: (
        <>
          <h2
            {...omitProps(slotProps?.title, ["data-part", "children", "dangerouslySetInnerHTML"])}
            data-part="title"
          >
            {title}
          </h2>
          <ul
            {...omitProps(slotProps?.list, ["data-part", "children", "dangerouslySetInnerHTML"])}
            data-part="list"
          >
            {errors.map((error, index) => (
              <li
                {...resolveRepeatedSlotProps(slotProps?.item, error.href, ["data-part"])}
                data-part="item"
                key={`${error.href}-${index}`}
              >
                <a
                  {...resolveRepeatedSlotProps(slotProps?.link, error.href, ["data-part", "href"])}
                  data-part="link"
                  href={error.href}
                >
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

import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
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
      ...consumerProps,
      className: cn("uiify-form-error-summary", consumerProps.className),
      children: (
        <>
          <h2
            {...slotProps?.title}
            className={cn("uiify-form-error-summary-title", slotProps?.title?.className)}
          >
            {title}
          </h2>
          <ul
            {...slotProps?.list}
            className={cn("uiify-form-error-summary-list", slotProps?.list?.className)}
          >
            {errors.map((error, index) => {
              const itemProps = resolveRepeatedSlotProps(slotProps?.item, error.href);
              const linkProps = resolveRepeatedSlotProps(slotProps?.link, error.href);
              return (
                <li
                  {...itemProps}
                  className={cn("uiify-form-error-summary-item", itemProps.className)}
                  key={`${error.href}-${index}`}
                >
                  <a
                    href={error.href}
                    {...linkProps}
                    className={cn("uiify-form-error-summary-link", linkProps.className)}
                  >
                    {error.message}
                  </a>
                </li>
              );
            })}
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

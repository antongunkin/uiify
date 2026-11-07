import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type {
  DescriptionDetailsProps,
  DescriptionListProps,
  DescriptionTermProps,
} from "./types.js";

export function DescriptionList<TAs extends ElementType = "dl">(
  props: DescriptionListProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as DescriptionListProps<"dl">;
  return useRenderElement({
    as,
    defaultTag: "dl",
    props: {
      ...consumerProps,
      className: cn(
        "uiify-description-list",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

export function DescriptionTerm<TAs extends ElementType = "dt">(
  props: DescriptionTermProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as DescriptionTermProps<"dt">;
  return useRenderElement({
    as,
    defaultTag: "dt",
    props: {
      ...consumerProps,
      className: cn(
        "uiify-description-list-term",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

export function DescriptionDetails<TAs extends ElementType = "dd">(
  props: DescriptionDetailsProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as DescriptionDetailsProps<"dd">;
  return useRenderElement({
    as,
    defaultTag: "dd",
    props: {
      ...consumerProps,
      className: cn(
        "uiify-description-list-details",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

DescriptionList.displayName = "DescriptionList";
DescriptionTerm.displayName = "DescriptionTerm";
DescriptionDetails.displayName = "DescriptionDetails";

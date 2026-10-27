import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export interface FormErrorSummaryError {
  readonly href: string;
  readonly message: ReactNode;
}

type FormErrorSummaryPartProps<TTag extends ElementType> = Omit<
  ComponentPropsWithRef<TTag>,
  "children" | "dangerouslySetInnerHTML" | "data-part"
>;

type FormErrorSummaryPartSlotProps<TTag extends ElementType> = FormErrorSummaryPartProps<TTag> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
  };

type FormErrorSummaryRepeatedSlotProps<
  TTag extends ElementType,
  TProtected extends object = object,
> = RepeatedSlotProps<
  FormErrorSummaryPartProps<TTag>,
  TProtected & { readonly "data-part"?: never }
>;

export interface FormErrorSummarySlotProps {
  readonly title?: FormErrorSummaryPartSlotProps<"h2">;
  readonly list?: FormErrorSummaryPartSlotProps<"ul">;
  /** Repeated error props may target an error by its stable href value. */
  readonly item?: FormErrorSummaryRepeatedSlotProps<"li">;
  readonly link?: FormErrorSummaryRepeatedSlotProps<"a", { readonly href?: never }>;
}

export interface FormErrorSummaryOwnProps {
  readonly title: ReactNode;
  readonly errors: readonly FormErrorSummaryError[];
  readonly slotProps?: FormErrorSummarySlotProps;
}

export type FormErrorSummaryProps<TAs extends ElementType = "section"> = RenderableProps<
  TAs,
  FormErrorSummaryOwnProps,
  Record<string, never>,
  HTMLElement
>;

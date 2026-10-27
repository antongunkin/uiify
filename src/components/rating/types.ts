import type { ComponentPropsWithRef } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";
import type { ChoiceOptionSlotProps } from "../internal/choice-family/types.js";

export interface RatingOwnProps {
  readonly id: string;
  readonly defaultValue?: number;
  readonly max?: number;
  readonly readOnly?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly "aria-label"?: string;
  /** Props for each generated item, radio input, or label. Values target one rating item. */
  readonly slotProps?: RatingSlotProps;
}

export type RatingSlotProps = ChoiceOptionSlotProps;

export type RatingProps = RatingOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    | keyof RatingOwnProps
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-orientation"
    | "data-part"
    | "data-uiify-choice"
    | "data-uiify-rating"
  > &
  ConsumerDataAttributes & {
    readonly "data-orientation"?: never;
    readonly "data-uiify-choice"?: never;
    readonly "data-uiify-rating"?: never;
  };

export interface RatingClientProps extends RatingProps {
  readonly value?: number;
  readonly onValueChange?: (value: number) => void;
}

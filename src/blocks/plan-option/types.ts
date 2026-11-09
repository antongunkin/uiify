import type { ComponentPropsWithRef } from "react";
import type { BadgeOwnProps } from "../../components/badge/index.js";
import type {
  FieldDescriptionProps,
  FieldLabelProps,
  FieldProps,
} from "../../components/field/index.js";
import type { RadioGroupItemProps } from "../../components/radio-group/index.js";

/** Native props of each node PlanOption renders for you; ids and ARIA here replace the derived ones. */
export interface PlanOptionSlotProps {
  readonly input?: Omit<RadioGroupItemProps, "name" | "value">;
  readonly content?: Omit<ComponentPropsWithRef<"div">, "children">;
  readonly label?: Omit<FieldLabelProps, "children">;
  readonly badge?: Omit<ComponentPropsWithRef<"span">, "children"> &
    Pick<BadgeOwnProps, "variant" | "size">;
  readonly price?: Omit<FieldDescriptionProps, "children">;
  readonly description?: Omit<FieldDescriptionProps, "children">;
}

export interface PlanOptionOwnProps {
  /** Same literal name on every option of one choice; submitted as `name=value`. */
  readonly name: string;
  /** Submitted value; with `name` it makes the radio id `${name}-${value}`. */
  readonly value: string;
  /** Plan name, the visible label of the radio. */
  readonly title: string;
  /** Price with its period, such as "$39.99 / year". */
  readonly price?: string | undefined;
  /** Who the plan suits or what it includes, in one sentence. */
  readonly description?: string | undefined;
  /** Short visible mark inside the label, such as "Save 33%". */
  readonly badge?: string | undefined;
  readonly defaultChecked?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly required?: boolean | undefined;
  readonly slotProps?: PlanOptionSlotProps | undefined;
}

/**
 * One plan as a radio choice card: a native radio, its label with an optional badge, and the price
 * and description it lists in `aria-describedby`. Root props go to the card (`Field`); put options of
 * one choice in a `RadioGroup`.
 */
export type PlanOptionProps = PlanOptionOwnProps &
  Omit<FieldProps, keyof PlanOptionOwnProps | "children" | "orientation" | "variant" | "invalid">;

// RadioGroup and RadioGroupItem names informed by shadcn/ui public documentation (names and props only).
import type { ComponentPropsWithRef, ReactNode } from "react";

export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioGroupOwnProps {
  /** RadioGroupItem controls, each with its label (usually one Field per option). */
  readonly children?: ReactNode;
  /**
   * Written as data-orientation.
   * @default "vertical"
   */
  readonly orientation?: RadioGroupOrientation;
}

/**
 * A `div role="radiogroup"`. Name it with `aria-label`/`aria-labelledby`, or leave it unnamed
 * inside a FieldSet whose FieldLegend names the group. It has no `name`, `defaultValue`,
 * `disabled` or `required`: those are native props of each RadioGroupItem.
 */
export type RadioGroupProps = RadioGroupOwnProps &
  // `defaultValue` is omitted: on a div it does nothing; select with `defaultChecked` on an item.
  Omit<ComponentPropsWithRef<"div">, keyof RadioGroupOwnProps | "defaultValue">;

export interface RadioGroupItemOwnProps {
  /** Same literal name on every item of one group; the browser groups radios by name. */
  readonly name: string;
  /** Submitted as `name=value` when this radio is checked. */
  readonly value: string;
}

/**
 * A native `input type="radio"`. Label it with `FieldLabel htmlFor` (its `id`); select it
 * initially with `defaultChecked`. `disabled`, `required` and `form` are native props.
 */
export type RadioGroupItemProps = RadioGroupItemOwnProps &
  Omit<
    ComponentPropsWithRef<"input">,
    keyof RadioGroupItemOwnProps | "type" | "children" | "dangerouslySetInnerHTML"
  >;

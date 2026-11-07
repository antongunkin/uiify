// Tabs, TabsList, TabsTrigger and TabsContent names informed by shadcn/ui public documentation
// (names and props only).
import type { ComponentPropsWithRef, ReactNode } from "react";

export type TabsOrientation = "horizontal" | "vertical";

export interface TabsOwnProps {
  /** One TabsList, then one TabsContent per TabsTrigger, in trigger order. */
  readonly children?: ReactNode;
  /**
   * Written as data-orientation.
   * @default "horizontal"
   */
  readonly orientation?: TabsOrientation;
}

/**
 * A `div` that pairs the i-th checked TabsTrigger with the i-th TabsContent in CSS (up to 12
 * tabs). It has no `defaultValue`: select initially with `defaultChecked` on one TabsTrigger.
 */
export type TabsProps = TabsOwnProps &
  // `defaultValue` is omitted: without context a div cannot select a trigger.
  Omit<ComponentPropsWithRef<"div">, keyof TabsOwnProps | "defaultValue">;

export interface TabsListOwnProps {
  /** TabsTrigger parts, as direct children. */
  readonly children?: ReactNode;
}

export type TabsListProps = TabsListOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof TabsListOwnProps>;

export interface TabsTriggerOwnProps {
  /** Same literal name on every trigger of one Tabs; the browser groups the radios by name. */
  readonly name: string;
  /** The radio's value; list TabsContent in the same order as the triggers. */
  readonly value: string;
  /**
   * The radio's id, which the label points at.
   * @default `${name}-${value}`
   */
  readonly id?: string;
  /** Selects this tab initially; set it on one trigger. */
  readonly defaultChecked?: boolean;
  /** Native `disabled` on the radio, `data-disabled` on the label. */
  readonly disabled?: boolean;
  /** The visible label. */
  readonly children?: ReactNode;
}

/**
 * A native `input type="radio"` (visually hidden) and its `label`, wrapped in a
 * `display: contents` span. Native props, `className`, `style` and `ref` go to the label.
 */
export type TabsTriggerProps = TabsTriggerOwnProps &
  Omit<ComponentPropsWithRef<"label">, keyof TabsTriggerOwnProps | "htmlFor">;

export interface TabsContentOwnProps {
  /** The value of the matching TabsTrigger; written as data-value. Pairing is by position. */
  readonly value: string;
  readonly children?: ReactNode;
}

export type TabsContentProps = TabsContentOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof TabsContentOwnProps>;

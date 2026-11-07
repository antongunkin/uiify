// Accordion, AccordionItem, AccordionTrigger and AccordionContent names informed by shadcn/ui
// public documentation (names and props only).
import type { ComponentPropsWithRef, ReactNode } from "react";

export interface AccordionOwnProps {
  /** AccordionItem parts. */
  readonly children?: ReactNode;
}

/**
 * A `div` around native `<details>` items. It has no `type`, `collapsible` or `defaultValue`:
 * single-open is the same `name` on every AccordionItem, and `defaultOpen` opens an item.
 */
export type AccordionProps = AccordionOwnProps &
  // `defaultValue` is omitted: without context a div cannot open an item.
  Omit<ComponentPropsWithRef<"div">, keyof AccordionOwnProps | "defaultValue">;

export interface AccordionItemOwnProps {
  /** Identifies the item; written as data-value. */
  readonly value: string;
  /**
   * The same literal name on every item makes the group single-open (native exclusive
   * `<details name>`); leave it out for multiple open items.
   */
  readonly name?: string | undefined;
  /** Applies the native `open` attribute on first render. */
  readonly defaultOpen?: boolean;
  /** One AccordionTrigger, then one AccordionContent. */
  readonly children?: ReactNode;
}

export type AccordionItemProps = AccordionItemOwnProps &
  Omit<ComponentPropsWithRef<"details">, keyof AccordionItemOwnProps>;

export interface AccordionTriggerOwnProps {
  /** `aria-disabled` and `tabIndex={-1}` on the summary; it cannot be clicked or focused. */
  readonly disabled?: boolean;
  /** The visible summary. */
  readonly children?: ReactNode;
}

export type AccordionTriggerProps = AccordionTriggerOwnProps &
  Omit<ComponentPropsWithRef<"summary">, keyof AccordionTriggerOwnProps>;

export interface AccordionContentOwnProps {
  readonly children?: ReactNode;
}

export type AccordionContentProps = AccordionContentOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof AccordionContentOwnProps>;

// API informed by shadcn/ui public documentation (names and props only).
import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import {
  NativeDetailsContent,
  NativeDetailsRoot,
  NativeDetailsSummary,
} from "../../elements/native-details/index.js";
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./types.js";

/**
 * Built on `@gunkin/uiify/elements/native-details`: native `<details>` owns open state, and the same
 * `name` on every AccordionItem makes the browser keep one item open. No context, no JS.
 */
export function Accordion({ className, children, ...consumerProps }: AccordionProps): ReactElement {
  return (
    <div {...consumerProps} className={cn("uiify-accordion", className)}>
      {children}
    </div>
  );
}
Accordion.displayName = "Accordion";

export function AccordionItem({
  value,
  className,
  children,
  ...consumerProps
}: AccordionItemProps): ReactElement {
  return (
    <NativeDetailsRoot
      data-value={value}
      {...consumerProps}
      className={cn("uiify-accordion-item", className)}
    >
      {children}
    </NativeDetailsRoot>
  );
}
AccordionItem.displayName = "AccordionItem";

export function AccordionTrigger({
  className,
  children,
  ...consumerProps
}: AccordionTriggerProps): ReactElement {
  return (
    <NativeDetailsSummary {...consumerProps} className={cn("uiify-accordion-trigger", className)}>
      {children}
    </NativeDetailsSummary>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

export function AccordionContent({
  className,
  children,
  ...consumerProps
}: AccordionContentProps): ReactElement {
  return (
    <NativeDetailsContent {...consumerProps} className={cn("uiify-accordion-content", className)}>
      {children}
    </NativeDetailsContent>
  );
}
AccordionContent.displayName = "AccordionContent";

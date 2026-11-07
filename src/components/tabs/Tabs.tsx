// API informed by shadcn/ui public documentation (names and props only).
import type { ReactElement } from "react";
import { cn } from "../../core/class-names.js";
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from "./types.js";

/**
 * Tier 0 tabs: native radios and labels, no context. `behavior.css` pairs the i-th checked
 * trigger with the i-th content by position (`:has()` + `:nth-child(n of S)`, up to 12 tabs).
 */
export function Tabs({
  orientation = "horizontal",
  className,
  children,
  ...consumerProps
}: TabsProps): ReactElement {
  return (
    <div data-orientation={orientation} {...consumerProps} className={cn("uiify-tabs", className)}>
      {children}
    </div>
  );
}
Tabs.displayName = "Tabs";

export function TabsList({ className, children, ...consumerProps }: TabsListProps): ReactElement {
  return (
    <div {...consumerProps} className={cn("uiify-tabs-list", className)}>
      {children}
    </div>
  );
}
TabsList.displayName = "TabsList";

/**
 * A visually hidden radio immediately followed by its label, in a `display: contents` span so
 * the label's checked/focus styles (`peer-*`) never reach the next trigger's label.
 */
export function TabsTrigger({
  name,
  value,
  id,
  defaultChecked,
  disabled,
  className,
  children,
  ...consumerProps
}: TabsTriggerProps): ReactElement {
  const controlId = id ?? `${name}-${value}`;
  return (
    <span className="uiify-tabs-item">
      <input
        className="peer/tabs uiify-tabs-control"
        {...(defaultChecked ? { defaultChecked: true } : {})}
        {...(disabled ? { disabled: true } : {})}
        id={controlId}
        name={name}
        type="radio"
        value={value}
      />
      <label
        data-disabled={disabled ? "" : undefined}
        {...consumerProps}
        className={cn("uiify-tabs-trigger", className)}
        htmlFor={controlId}
      >
        {children}
      </label>
    </span>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({
  value,
  className,
  children,
  ...consumerProps
}: TabsContentProps): ReactElement {
  return (
    <div data-value={value} {...consumerProps} className={cn("uiify-tabs-content", className)}>
      {children}
    </div>
  );
}
TabsContent.displayName = "TabsContent";

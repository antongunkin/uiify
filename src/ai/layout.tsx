import type { ComponentType, ReactElement, ReactNode } from "react";
import type { GridProps, SectionProps, StackProps } from "./catalog.generated.js";

/**
 * Layout nodes of a UI document. They are plain elements marked with `data-ui-layout`
 * and styled by `styles/components/ai-layout.css`, so they need no hooks and no client JS.
 */

export function Stack({
  direction,
  gap,
  align,
  wrap,
  children,
}: StackProps & { children?: ReactNode }): ReactElement {
  return (
    <div
      data-ui-layout="stack"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-wrap={wrap ? "true" : undefined}
    >
      {children}
    </div>
  );
}
Stack.displayName = "Stack";

export function Grid({
  columns,
  gap,
  children,
}: GridProps & { children?: ReactNode }): ReactElement {
  return (
    <div data-ui-layout="grid" data-columns={columns} data-gap={gap}>
      {children}
    </div>
  );
}
Grid.displayName = "Grid";

export function Section({
  as: Tag = "section",
  padding,
  width,
  children,
}: SectionProps & { children?: ReactNode }): ReactElement {
  return (
    <Tag data-ui-layout="section" data-padding={padding} data-width={width}>
      {children}
    </Tag>
  );
}
Section.displayName = "Section";

// oxlint-disable-next-line typescript/no-explicit-any -- each node takes its own props
export const layoutComponents: Readonly<Record<"Stack" | "Grid" | "Section", ComponentType<any>>> =
  { Stack, Grid, Section };

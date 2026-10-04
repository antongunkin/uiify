"use client";

import type { ReactElement, Ref } from "react";
import { RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
import { TableBody as TableBodyElement } from "../TableShell.js";
import { TableProvider, useTableContext } from "./table-context.js";

export function TableBody(
  props: React.ComponentProps<typeof TableBodyElement>,
): ReactElement | null {
  const context = useTableContext("Body");
  const { interactive } = context;
  const { children, as, render, ...consumerProps } = props;

  const rows = <TableProvider value={{ ...context, inBody: true }}>{children}</TableProvider>;
  if (!interactive) {
    return <TableBodyElement {...props}>{rows}</TableBodyElement>;
  }

  if (render) {
    return (
      <RovingFocusRoot
        {...consumerProps}
        loop
        orientation="both"
        data-part="body"
        render={(rootProps) =>
          render(
            { ...rootProps, children: rows } as Record<string, unknown> & {
              ref?: Ref<HTMLTableSectionElement>;
            },
            {},
          )
        }
      />
    );
  }
  return (
    <RovingFocusRoot {...consumerProps} as={as ?? "tbody"} loop orientation="both" data-part="body">
      {rows}
    </RovingFocusRoot>
  );
}
TableBody.displayName = "TableBody";

"use client";

import type { ReactElement } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import type { TableExpandTriggerProps, TableExpandedRowProps } from "../types.js";
import { useTableContext } from "./table-context.js";

export function TableExpandTrigger({
  rowId,
  onClick,
  ...props
}: TableExpandTriggerProps): ReactElement {
  const { instanceId, expandedKeys, toggleExpanded } = useTableContext("ExpandTrigger");
  return (
    <button
      {...props}
      type="button"
      data-uiify-button=""
      data-variant="ghost"
      data-part="expand-trigger"
      aria-expanded={expandedKeys.has(rowId)}
      aria-controls={`${instanceId}-expanded-${rowId}`}
      onClick={composeEventHandlers(onClick, () => toggleExpanded(rowId))}
    />
  );
}
TableExpandTrigger.displayName = "TableExpandTrigger";

export function TableExpandedRow({ rowId, ...props }: TableExpandedRowProps): ReactElement {
  const { instanceId, expandedKeys } = useTableContext("ExpandedRow");
  return (
    <tr
      {...props}
      id={`${instanceId}-expanded-${rowId}`}
      data-part="expanded-row"
      hidden={!expandedKeys.has(rowId)}
    />
  );
}
TableExpandedRow.displayName = "TableExpandedRow";

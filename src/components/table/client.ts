"use client";
export {
  Table as TableClient,
  TableRoot,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableSelectAll,
  TableRowSelect,
  TableExpandTrigger,
  TableExpandedRow,
} from "./client/Table.js";
export { TableCell, TableCaption, TableHeader, TableFooter, TableRowHeader } from "./TableShell.js";
export type {
  TableClientRootProps,
  TableClientRootOwnProps,
  TableClientColumnHeaderProps,
  TableClientColumnHeaderSlotProps,
  TableExpandTriggerProps,
  TableExpandedRowProps,
  TableSelectAllOwnProps,
  TableSelectionSlotProps,
  SortDescriptor,
  SelectionMode,
} from "./types.js";

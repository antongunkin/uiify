"use client";
export {
  TableOfContents,
  TableOfContentsClientRoot as TableOfContentsRoot,
} from "./TableOfContentsClient.js";
export {
  TableOfContentsClientTrigger as TableOfContentsTrigger,
  TableOfContentsClientContent as TableOfContentsContent,
  TableOfContentsClientLink as TableOfContentsLink,
  TableOfContentsClientIndicator as TableOfContentsIndicator,
} from "./TableOfContentsClientParts.js";
export { TableOfContentsRail, TableOfContentsList } from "../TableOfContents.js";
export type {
  TableOfContentsClientRootOwnProps,
  TableOfContentsClientRootProps,
  TableOfContentsLevel,
  TableOfContentsTriggerProps,
  TableOfContentsRailProps,
  TableOfContentsContentProps,
  TableOfContentsListProps,
  TableOfContentsLinkProps,
  TableOfContentsIndicatorProps,
} from "../types.js";

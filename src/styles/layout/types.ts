import type { LayoutCondition, LayoutPart } from "../../core/layout/index.js";
export type CssDeclarations = Readonly<Record<string, string>>;
export type LayoutDeclarationTables = Readonly<
  Record<LayoutPart, Readonly<Record<string, Readonly<Record<string, CssDeclarations>>>>>
>;
export type LayoutDefaultDeclarations = Readonly<Record<LayoutPart, CssDeclarations>>;
export type ResolvedLayoutDeclarations = Record<LayoutCondition, Record<string, string>>;

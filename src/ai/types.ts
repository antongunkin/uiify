import type { ComponentType } from "react";
import type { UiNode, UiType } from "./catalog.generated.js";

/** A stored UI document: a version and one root node. */
export interface UiDocumentData {
  readonly version: 1;
  readonly root: UiNode;
}

/** One problem found in a document, written so a person or a model can repair it. */
export interface UiValidationIssue {
  /** Stable category for repair tooling; existing readable diagnostics remain available. */
  readonly code?: string;
  /** JSON Pointer into the validated value, e.g. `/root/children/0/props/variant`. */
  readonly path: string;
  /** Readable location, e.g. `form › Field › Button.props.variant`. */
  readonly breadcrumb: string;
  readonly message: string;
  /** The values that would have been accepted, when the problem is a closed set. */
  readonly allowed?: readonly unknown[];
}

/** Thrown when a document is invalid; carries the same issues `validateDocument` returns. */
export class UiDocumentError extends Error {
  readonly issues: readonly UiValidationIssue[];

  constructor(issues: readonly UiValidationIssue[]) {
    const shown = issues.slice(0, 10).map((issue) => `- ${issue.breadcrumb}: ${issue.message}`);
    const more = issues.length > shown.length ? [`- and ${issues.length - shown.length} more`] : [];
    super(["Invalid UI document:", ...shown, ...more].join("\n"));
    this.name = "UiDocumentError";
    this.issues = issues;
  }
}

/** A validated document with the component of every part type it uses, ready to render. */
export interface LoadedDocument {
  readonly root: UiNode;
  /** Component and layout parts by type; native types render as their own tag. */
  // oxlint-disable-next-line typescript/no-explicit-any -- each part takes its own props
  readonly components: ReadonlyMap<UiType, ComponentType<any>>;
}

export interface UiDocumentProps {
  /** Untrusted document data: `{ version: 1, root }` or a bare node. */
  readonly node: unknown;
}

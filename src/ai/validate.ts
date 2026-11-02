import type { UiNode } from "./catalog.generated.js";
import { toIssues } from "./issues.js";
import { checkLimits } from "./limits.js";
import { checkRules } from "./rules.js";
import type { UiDocumentData, UiValidationIssue } from "./types.js";
import { validateSchema } from "./validator.generated.js";

export type UiValidationResult =
  | { readonly ok: true; readonly document: UiDocumentData }
  | { readonly ok: false; readonly issues: readonly UiValidationIssue[] };

function fail(issues: readonly UiValidationIssue[]): UiValidationResult {
  return { ok: false, issues };
}

/**
 * Validates untrusted data as a UI document: `{ version: 1, root }`, or a bare node, which is
 * wrapped. Stages run in order and stop at the first that fails: limits, version, schema, rules.
 * Nothing in the value is evaluated or modified.
 */
export function validateDocument(value: unknown): UiValidationResult {
  const limitIssues = checkLimits(value);
  if (limitIssues.length > 0) return fail(limitIssues);

  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
  const bare = isObject && Object.hasOwn(value, "type");

  if (
    isObject &&
    !bare &&
    Object.hasOwn(value, "version") &&
    (value as { version: unknown }).version !== 1
  ) {
    const version = (value as { version: unknown }).version;
    return fail([
      {
        code: "version.unsupported",
        path: "/version",
        breadcrumb: "version",
        message: `unsupported version ${typeof version === "string" ? JSON.stringify(version) : String(JSON.stringify(version))}; this validator reads version 1`,
        allowed: [1],
      },
    ]);
  }

  if (!validateSchema(value)) return fail(toIssues(validateSchema.errors, value));

  const document: UiDocumentData = bare
    ? { version: 1, root: value as UiNode }
    : (value as UiDocumentData);
  const ruleIssues = checkRules(document.root, bare ? "" : "/root");
  return ruleIssues.length > 0 ? fail(ruleIssues) : { ok: true, document };
}

import type { ComponentType } from "react";
import type { UiChild, UiNode, UiType } from "./catalog.generated.js";
import { uiParts } from "./catalog.generated.js";
import { layoutComponents } from "./layout.js";
import { uiLoaders } from "./loaders.generated.js";
import type { LoadedDocument, UiDocumentData } from "./types.js";
import { UiDocumentError } from "./types.js";
import { validateDocument } from "./validate.js";

/** Validates untrusted data as a document, or throws `UiDocumentError` with its issues. */
export function assertDocument(value: unknown): UiDocumentData {
  const result = validateDocument(value);
  if (!result.ok) throw new UiDocumentError(result.issues);
  return result.document;
}

/** A node's children; leaf parts have none. */
export function childrenOf(node: UiNode): readonly UiChild[] {
  return (node as { readonly children?: readonly UiChild[] }).children ?? [];
}

function collectTypes(node: UiNode, types: Set<UiType>): Set<UiType> {
  types.add(node.type);
  for (const child of childrenOf(node)) {
    if (typeof child !== "string") collectTypes(child, types);
  }
  return types;
}

// oxlint-disable-next-line typescript/no-explicit-any -- each part takes its own props
async function loadComponent(type: UiType): Promise<ComponentType<any>> {
  const kind = uiParts[type].kind;
  if (kind === "layout") return layoutComponents[type as keyof typeof layoutComponents];
  const load = uiLoaders[type];
  if (!load) throw new Error(`No loader for UI part type ${type}`);
  return load();
}

/** A copy of `value` nothing outside can change, or `undefined` when it cannot be copied. */
function frozenCopy(value: unknown): unknown {
  let copy: unknown;
  try {
    // Copies data only (getters run once, here); functions and symbols make it throw.
    copy = structuredClone(value);
  } catch {
    return undefined;
  }
  // Iterative, so a deep or cyclic value cannot exhaust the stack; validation rejects both.
  const stack: unknown[] = [copy];
  while (stack.length > 0) {
    const current = stack.pop();
    if (typeof current !== "object" || current === null || Object.isFrozen(current)) continue;
    Object.freeze(current);
    for (const key of Object.keys(current)) stack.push((current as Record<string, unknown>)[key]);
  }
  return copy;
}

/**
 * Validates `value`, then loads the component of every part type it uses, and only those.
 * Rejects with `UiDocumentError` when the document is invalid.
 *
 * Documents are immutable: this validates and renders a deep-frozen `structuredClone` of
 * `value`, so changing `value` afterwards never reaches what was validated. To show a changed
 * document, pass a new object.
 */
export async function loadDocument(value: unknown): Promise<LoadedDocument> {
  const copy = frozenCopy(value);
  // Never validate or render the original: a Proxy can pass validation and change afterwards.
  if (copy === undefined && value !== undefined) {
    throw new UiDocumentError([
      {
        path: "",
        breadcrumb: "document",
        message: "a document must be plain data that structuredClone can copy",
      },
    ]);
  }
  const { root } = assertDocument(copy);
  const types = [...collectTypes(root, new Set())].filter(
    (type) => uiParts[type].kind !== "native",
  );
  const loaded = await Promise.all(
    types.map(async (type) => [type, await loadComponent(type)] as const),
  );
  return { root, components: new Map(loaded) };
}

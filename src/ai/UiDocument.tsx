import { createElement, use } from "react";
import type { ComponentType, ReactElement, ReactNode } from "react";
import type { UiChild, UiNode, UiType } from "./catalog.generated.js";
import { uiParts } from "./catalog.generated.js";
import { assertDocument, childrenOf, loadDocument } from "./load.js";
import type { LoadedDocument, UiDocumentProps } from "./types.js";

// One load per document object, so every render of the same `node` hands `use()` the same promise.
const loads = new WeakMap<object, Promise<LoadedDocument>>();

function loadOnce(node: unknown): Promise<LoadedDocument> {
  if (typeof node !== "object" || node === null) {
    // A primitive cannot key the WeakMap and is never a valid document: throw its issues now.
    assertDocument(node);
    return loadDocument(node);
  }
  let load = loads.get(node);
  if (!load) {
    load = loadDocument(node);
    loads.set(node, load);
  }
  return load;
}

function renderNode(
  node: UiNode,
  // oxlint-disable-next-line typescript/no-explicit-any -- each part takes its own props
  components: ReadonlyMap<UiType, ComponentType<any>>,
  key?: number,
): ReactElement {
  const type = uiParts[node.type].kind === "native" ? node.type : components.get(node.type);
  if (type === undefined) throw new Error(`UI part type ${node.type} was not loaded`);
  const children = childrenOf(node).map((child: UiChild, index: number): ReactNode =>
    typeof child === "string" ? child : renderNode(child, components, index),
  );
  return createElement(type, key === undefined ? node.props : { ...node.props, key }, ...children);
}

/**
 * Renders an untrusted UI document. It validates first and throws `UiDocumentError` instead of
 * rendering a partial guess, then renders each part with its UIify component. It uses no state
 * or context, so it runs in a Server Component and hydrates on the client; wrap it in `Suspense`.
 *
 * Documents are immutable: the first render of a `node` object validates and renders a frozen
 * copy of it (see `loadDocument`), and later changes to that object are ignored. Pass a new
 * object to render a changed document.
 */
export function UiDocument({ node }: UiDocumentProps): ReactElement {
  const { root, components } = use(loadOnce(node));
  return renderNode(root, components);
}
UiDocument.displayName = "UiDocument";

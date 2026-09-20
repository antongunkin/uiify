import type { OpenChangeReason } from "./open-change-details.js";
import { getEventPath, isEventInsideLayer } from "./platform.js";

export interface DismissableLayerRecord {
  readonly branches: Set<Element>;
  readonly element: Element;
  readonly onDismiss: (reason: OpenChangeReason, event: Event) => void;
}

interface Registry {
  readonly controller: AbortController;
  readonly layers: DismissableLayerRecord[];
}

const registries = new WeakMap<Document, Registry>();

function dispatch(document: Document, reason: OpenChangeReason, event: Event): void {
  const record = registries.get(document)?.layers.at(-1);
  if (!record) return;
  if (
    reason !== "escape-key" &&
    isEventInsideLayer(getEventPath(event), record.element, record.branches)
  ) {
    return;
  }
  record.onDismiss(reason, event);
}

function createRegistry(document: Document): Registry {
  const AbortControllerConstructor = document.defaultView?.AbortController ?? AbortController;
  const controller = new AbortControllerConstructor();
  const options = { capture: true, signal: controller.signal };
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") dispatch(document, "escape-key", event);
    },
    options,
  );
  document.addEventListener(
    "pointerdown",
    (event) => dispatch(document, "outside-press", event),
    options,
  );
  document.addEventListener(
    "focusin",
    (event) => dispatch(document, "focus-outside", event),
    options,
  );
  return { controller, layers: [] };
}

export function registerDismissableLayer(
  document: Document,
  record: DismissableLayerRecord,
): () => void {
  const registry = registries.get(document) ?? createRegistry(document);
  registries.set(document, registry);
  registry.layers.push(record);

  return () => {
    const index = registry.layers.indexOf(record);
    if (index >= 0) registry.layers.splice(index, 1);
    if (registry.layers.length === 0) {
      registry.controller.abort();
      registries.delete(document);
    }
  };
}

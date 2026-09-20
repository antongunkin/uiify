import { describe, expect, it, vi } from "vitest";
import {
  registerDismissableLayer,
  type DismissableLayerRecord,
} from "./dismissable-layer-registry.js";

function createRecord(document: Document): DismissableLayerRecord {
  return {
    branches: new Set(),
    element: document.createElement("div"),
    onDismiss: vi.fn(),
  };
}

describe("dismissable layer registries", () => {
  it("keeps documents independent", () => {
    const firstDocument = document.implementation.createHTMLDocument("first");
    const secondDocument = document.implementation.createHTMLDocument("second");
    const first = createRecord(firstDocument);
    const second = createRecord(secondDocument);
    const unregisterFirst = registerDismissableLayer(firstDocument, first);
    const unregisterSecond = registerDismissableLayer(secondDocument, second);

    firstDocument.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(first.onDismiss).toHaveBeenCalledOnce();
    expect(second.onDismiss).not.toHaveBeenCalled();

    unregisterFirst();
    unregisterSecond();
  });
});

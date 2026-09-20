import { describe, expect, it } from "vitest";
import {
  getCoreCapabilities,
  getEventPath,
  isEventInsideLayer,
  supportsAnchorPositioning,
  supportsCheckVisibility,
  supportsDialogRequestClose,
  supportsPopover,
} from "./platform.js";

describe("platform capabilities", () => {
  it("is safe without browser constructors", () => {
    expect(getCoreCapabilities({})).toEqual({
      anchorPositioning: false,
      checkVisibility: false,
      dialogRequestClose: false,
      popover: false,
    });
  });

  it("detects individual capabilities", () => {
    class TestElement {
      checkVisibility() {
        return true;
      }
    }
    class TestHtmlElement {
      showPopover() {}
      hidePopover() {}
    }
    class TestDialog {
      requestClose() {}
    }
    const environment = {
      CSS: { supports: () => true },
      Element: TestElement as unknown as typeof Element,
      HTMLDialogElement: TestDialog as unknown as typeof HTMLDialogElement,
      HTMLElement: TestHtmlElement as unknown as typeof HTMLElement,
    };

    expect(supportsAnchorPositioning(environment)).toBe(true);
    expect(supportsCheckVisibility(environment)).toBe(true);
    expect(supportsDialogRequestClose(environment)).toBe(true);
    expect(supportsPopover(environment)).toBe(true);
  });

  it("falls back to the event target without composedPath", () => {
    const target = document.createElement("button");
    const event = new Event("click");
    Object.defineProperty(event, "target", { value: target });
    Object.defineProperty(event, "composedPath", { value: undefined });
    expect(getEventPath(event)).toEqual([target]);
  });

  it("detects when an event path is inside a layer or branch", () => {
    const layer = document.createElement("div");
    const branch = document.createElement("span");
    const inside = document.createElement("button");
    const outside = document.createElement("button");
    layer.append(inside);
    document.body.append(layer, branch, outside);

    expect(isEventInsideLayer([inside, layer], layer, new Set())).toBe(true);
    expect(isEventInsideLayer([branch], layer, new Set([branch]))).toBe(true);
    expect(isEventInsideLayer([outside], layer, new Set())).toBe(false);

    layer.remove();
    branch.remove();
    outside.remove();
  });
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs } from "../tabs/index.js";
import { syncPopoverTriggers, syncTabs } from "./sync.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("syncPopoverTriggers", () => {
  it("writes aria-expanded to every invoker pointing at the popover", () => {
    document.body.innerHTML = `
      <button id="a" command="toggle-popover" commandfor="menu" aria-expanded="false"></button>
      <button id="b" command="toggle-popover" commandfor="menu" aria-expanded="false"></button>
      <button id="c" command="toggle-popover" commandfor="other" aria-expanded="false"></button>
      <div id="menu" popover="auto"></div>
    `;

    syncPopoverTriggers("menu", true);

    expect(document.getElementById("a")!.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("b")!.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("c")!.getAttribute("aria-expanded")).toBe("false");
  });

  it("ignores hide-popover invokers", () => {
    document.body.innerHTML = `
      <button id="close" command="hide-popover" commandfor="menu" aria-expanded="false"></button>
    `;

    syncPopoverTriggers("menu", true);

    expect(document.getElementById("close")!.getAttribute("aria-expanded")).toBe("false");
  });

  it("escapes ids that are not bare identifiers", () => {
    document.body.innerHTML = `
      <button id="t" command="toggle-popover" commandfor="menu:1" aria-expanded="false"></button>
    `;

    expect(() => syncPopoverTriggers("menu:1", true)).not.toThrow();
    expect(document.getElementById("t")!.getAttribute("aria-expanded")).toBe("true");
  });

  it("is a no-op for an empty id", () => {
    expect(() => syncPopoverTriggers("", true)).not.toThrow();
  });
});

describe("syncTabs", () => {
  /**
   * Rendered from the real component. The previous fixture was hand-written and
   * invented `data-uiify-tabs-root`, `data-value` and `data-uiify-tabs-pair` —
   * none of which Tabs emits — so it kept passing while syncTabs was broken
   * against real markup.
   */
  function renderTabs(checkedValue: string): void {
    document.body.innerHTML = renderToStaticMarkup(
      createElement(Tabs, {
        id: "t1",
        defaultValue: "a",
        items: [
          { value: "a", label: "Overview", panel: null },
          { value: "b", label: "Settings", panel: null },
        ],
      }),
    );
    const input = document.querySelector<HTMLInputElement>(`input[value="${checkedValue}"]`)!;
    input.checked = true;
  }

  it("moves aria-selected, data-state and tabindex to the checked value", () => {
    renderTabs("b");

    syncTabs("t1");

    const [triggerA, triggerB] = [
      ...document.querySelectorAll<HTMLElement>('[data-uiify-tabs] [data-part="trigger"]'),
    ] as [HTMLElement, HTMLElement];
    const [panelA, panelB] = [
      ...document.querySelectorAll<HTMLElement>('[data-uiify-tabs] [data-part="panel"]'),
    ] as [HTMLElement, HTMLElement];

    expect(triggerA.getAttribute("aria-selected")).toBe("false");
    expect(triggerA.dataset["state"]).toBe("inactive");
    expect(triggerB.getAttribute("aria-selected")).toBe("true");
    expect(triggerB.dataset["state"]).toBe("active");
    expect(panelA.dataset["state"]).toBe("inactive");
    expect(panelA.tabIndex).toBe(-1);
    expect(panelB.dataset["state"]).toBe("active");
    expect(panelB.tabIndex).toBe(0);
  });

  it("is a no-op when the root id is not in the document", () => {
    expect(() => syncTabs("missing")).not.toThrow();
  });
});

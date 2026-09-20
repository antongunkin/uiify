import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs } from "../tabs/index.js";
import { attachEnhancers } from "./listeners.js";

let detach: (() => void) | undefined;

afterEach(() => {
  detach?.();
  detach = undefined;
  document.body.innerHTML = "";
});

/** jsdom does not implement the Popover API, so the toggle event is synthesised. */
function dispatchToggle(target: HTMLElement, newState: "open" | "closed"): void {
  target.dispatchEvent(Object.assign(new Event("toggle", { bubbles: false }), { newState }));
}

describe("attachEnhancers", () => {
  it("syncs aria-expanded from a non-bubbling toggle event", () => {
    document.body.innerHTML = `
      <button id="trigger" command="toggle-popover" commandfor="menu" aria-expanded="false"></button>
      <div id="menu" popover="auto"></div>
    `;
    detach = attachEnhancers();

    const popover = document.getElementById("menu")!;
    const trigger = document.getElementById("trigger")!;

    dispatchToggle(popover, "open");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    dispatchToggle(popover, "closed");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("ignores toggle events from elements that are not popovers", () => {
    document.body.innerHTML = `
      <button id="trigger" command="toggle-popover" commandfor="menu" aria-expanded="false"></button>
      <details id="menu"></details>
    `;
    detach = attachEnhancers();

    dispatchToggle(document.getElementById("menu")!, "open");

    expect(document.getElementById("trigger")!.getAttribute("aria-expanded")).toBe("false");
  });

  it("syncs tabs from a change event on a tabs radio", () => {
    // Rendered from the real component, not hand-written: the previous fixture
    // invented `data-uiify-tabs-root`, which Tabs never emits (its root carries
    // `data-uiify-tabs` + `id`). That divergence let the listener select a
    // non-existent attribute and made syncTabs dead code in production while
    // this test stayed green.
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
    detach = attachEnhancers();

    const inputB = document.querySelector<HTMLInputElement>('input[value="b"]')!;
    inputB.checked = true;
    inputB.dispatchEvent(new Event("change", { bubbles: true }));

    const [triggerA, triggerB] = [
      ...document.querySelectorAll<HTMLElement>("[data-uiify-tabs-trigger]"),
    ];
    expect(triggerA!.getAttribute("aria-selected")).toBe("false");
    expect(triggerB!.getAttribute("aria-selected")).toBe("true");

    const [panelA, panelB] = [...document.querySelectorAll<HTMLElement>("[data-uiify-tabs-panel]")];
    expect(panelA!.dataset["state"]).toBe("inactive");
    expect(panelB!.dataset["state"]).toBe("active");
  });

  it("stops responding after teardown", () => {
    document.body.innerHTML = `
      <button id="trigger" command="toggle-popover" commandfor="menu" aria-expanded="false"></button>
      <div id="menu" popover="auto"></div>
    `;
    const stop = attachEnhancers();
    stop();

    dispatchToggle(document.getElementById("menu")!, "open");

    expect(document.getElementById("trigger")!.getAttribute("aria-expanded")).toBe("false");
  });
});

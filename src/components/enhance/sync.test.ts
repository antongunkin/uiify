import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs/index.js";
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

/** Rendered from the real parts so selectors stay aligned with their markup. */
function tabs(name: string, values: readonly string[], checked: string, inner?: unknown) {
  return createElement(
    Tabs,
    { id: name },
    createElement(
      TabsList,
      null,
      ...values.map((value) =>
        createElement(
          TabsTrigger,
          { key: value, name, value, defaultChecked: value === checked },
          `${name} ${value}`,
        ),
      ),
    ),
    ...values.map((value, index) =>
      createElement(
        TabsContent,
        { key: value, value },
        index === 0 && inner ? (inner as never) : `${name} ${value} panel`,
      ),
    ),
  );
}

describe("syncTabs", () => {
  it("moves aria-selected, data-state and tabindex to the checked position", () => {
    document.body.innerHTML = renderToStaticMarkup(tabs("t1", ["a", "b"], "a"));
    document.querySelector<HTMLInputElement>('input[value="b"]')!.checked = true;

    syncTabs(document.getElementById("t1")!);

    const [triggerA, triggerB] = [
      ...document.querySelectorAll<HTMLElement>(".uiify-tabs-trigger"),
    ] as [HTMLElement, HTMLElement];
    const [panelA, panelB] = [...document.querySelectorAll<HTMLElement>(".uiify-tabs-content")] as [
      HTMLElement,
      HTMLElement,
    ];

    expect(triggerA.getAttribute("aria-selected")).toBe("false");
    expect(triggerA.dataset["state"]).toBe("inactive");
    expect(triggerB.getAttribute("aria-selected")).toBe("true");
    expect(triggerB.dataset["state"]).toBe("active");
    expect(panelA.dataset["state"]).toBe("inactive");
    expect(panelA.tabIndex).toBe(-1);
    expect(panelB.dataset["state"]).toBe("active");
    expect(panelB.tabIndex).toBe(0);
  });

  it("marks the first position active when nothing is checked, as the CSS shows it", () => {
    document.body.innerHTML = renderToStaticMarkup(tabs("t1", ["a", "b"], ""));

    syncTabs(document.getElementById("t1")!);

    const [panelA, panelB] = [...document.querySelectorAll<HTMLElement>(".uiify-tabs-content")];
    expect(panelA!.dataset["state"]).toBe("active");
    expect(panelB!.dataset["state"]).toBe("inactive");
  });

  it("keeps nested Tabs state isolated from the parent", () => {
    document.body.innerHTML = renderToStaticMarkup(
      tabs("outer", ["a", "b"], "a", tabs("inner", ["a", "b"], "b")),
    );
    document.querySelector<HTMLInputElement>("#outer-b")!.checked = true;

    syncTabs(document.getElementById("outer")!);

    const nestedTrigger = document.querySelector<HTMLElement>("#inner .uiify-tabs-trigger");
    const nestedPanel = document.querySelector<HTMLElement>("#inner .uiify-tabs-content");
    const parentTrigger = document.querySelector<HTMLElement>('label[for="outer-b"]');
    expect(nestedTrigger).not.toBeNull();
    expect(nestedPanel).not.toBeNull();
    expect(nestedTrigger?.hasAttribute("aria-selected")).toBe(false);
    expect(nestedPanel?.hasAttribute("data-state")).toBe(false);
    expect(parentTrigger?.getAttribute("aria-selected")).toBe("true");
  });
});

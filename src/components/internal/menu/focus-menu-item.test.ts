import { describe, expect, it } from "vitest";
import { focusMenuItem } from "./focus-menu-item.js";

function mountMenu(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  return container;
}

describe("focusMenuItem", () => {
  it("focuses the first enabled item", () => {
    const container = mountMenu(`
      <button role="menuitem" id="a">A</button>
      <button role="menuitem" id="b">B</button>
    `);
    focusMenuItem(container);
    expect(document.activeElement?.id).toBe("a");
  });

  it("focuses the last enabled item when asked", () => {
    const container = mountMenu(`
      <button role="menuitem" id="a">A</button>
      <button role="menuitem" id="b">B</button>
    `);
    focusMenuItem(container, { last: true });
    expect(document.activeElement?.id).toBe("b");
  });

  it("skips aria-disabled items — the behavior ContextMenu did not have", () => {
    const container = mountMenu(`
      <button role="menuitem" id="a" aria-disabled="true">A</button>
      <button role="menuitem" id="b">B</button>
    `);
    focusMenuItem(container);
    expect(document.activeElement?.id).toBe("b");
  });

  it("sees checkbox and radio items — the behavior DropdownMenu did not have before", () => {
    const container = mountMenu(`
      <button role="menuitemcheckbox" id="a">A</button>
      <button role="menuitemradio" id="b">B</button>
    `);
    focusMenuItem(container);
    expect(document.activeElement?.id).toBe("a");
  });

  it("does nothing for a null container or an empty menu", () => {
    expect(() => focusMenuItem(null)).not.toThrow();
    const container = mountMenu("<span>no items</span>");
    const before = document.activeElement;
    focusMenuItem(container);
    expect(document.activeElement).toBe(before);
  });
});

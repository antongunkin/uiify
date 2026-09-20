import { describe, expect, it, vi } from "vitest";
import { getTabbableCandidates, isFocusable, isTabbable } from "./tabbable.js";

describe("tabbable utilities", () => {
  it("orders positive tabindex before natural tab order", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <button id="natural">Natural</button>
      <button id="second" tabindex="2">Second</button>
      <button id="first" tabindex="1">First</button>
      <button id="disabled" disabled>Disabled</button>
    `;
    document.body.append(container);
    expect(getTabbableCandidates(container).map((element) => element.id)).toEqual([
      "first",
      "second",
      "natural",
    ]);
  });

  it("distinguishes focusable negative tabindex from tabbable", () => {
    const button = document.createElement("button");
    button.tabIndex = -1;
    document.body.append(button);
    expect(isFocusable(button)).toBe(true);
    expect(isTabbable(button)).toBe(false);
  });

  it("excludes inert descendants", () => {
    const parent = document.createElement("div");
    parent.setAttribute("inert", "");
    const button = document.createElement("button");
    parent.append(button);
    document.body.append(parent);
    expect(isFocusable(button)).toBe(false);
  });

  it("traverses open shadow roots", () => {
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const button = document.createElement("button");
    button.id = "shadow-button";
    root.append(button);
    document.body.append(host);
    expect(getTabbableCandidates(host).map((item) => item.id)).toEqual(["shadow-button"]);
  });

  it("excludes hidden and aria-hidden descendants without layout reads", () => {
    const parent = document.createElement("div");
    parent.setAttribute("aria-hidden", "true");
    const button = document.createElement("button");
    parent.append(button);
    document.body.append(parent);
    expect(isFocusable(button)).toBe(false);
  });

  it("does not call getComputedStyle while evaluating visibility", () => {
    const layoutRead = vi.spyOn(window, "getComputedStyle");
    const container = document.createElement("div");
    container.innerHTML = `<button id="visible">Visible</button>`;
    document.body.append(container);
    getTabbableCandidates(container);
    expect(layoutRead).not.toHaveBeenCalled();
    layoutRead.mockRestore();
  });
});

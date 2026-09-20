import { StrictMode, useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRovingFocusStore, RovingFocusItem, RovingFocusRoot } from "./roving-focus.js";

describe("RovingFocus", () => {
  it("moves the tab stop with arrow keys and skips disabled items", () => {
    render(
      <RovingFocusRoot orientation="horizontal">
        <RovingFocusItem as="button">One</RovingFocusItem>
        <RovingFocusItem as="button" disabled>
          Two
        </RovingFocusItem>
        <RovingFocusItem as="button">Three</RovingFocusItem>
      </RovingFocusRoot>,
    );
    const one = screen.getByRole("button", { name: "One" });
    const three = screen.getByRole("button", { name: "Three" });
    expect(one.tabIndex).toBe(0);
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(document.activeElement).toBe(three);
    expect(three.tabIndex).toBe(0);
    expect(one.tabIndex).toBe(-1);
  });

  it("lets a consumer onKeyDown veto arrow-key navigation (policy #2: roving-focus arrow-nav veto)", () => {
    render(
      <RovingFocusRoot orientation="horizontal">
        <RovingFocusItem as="button" onKeyDown={(event) => event.preventDefault()}>
          One
        </RovingFocusItem>
        <RovingFocusItem as="button">Two</RovingFocusItem>
      </RovingFocusRoot>,
    );
    const one = screen.getByRole("button", { name: "One" });
    one.focus();
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(document.activeElement).toBe(one);
  });

  it("honors RTL horizontal movement", () => {
    render(
      <RovingFocusRoot direction="rtl" orientation="horizontal">
        <RovingFocusItem as="button">First</RovingFocusItem>
        <RovingFocusItem as="button">Last</RovingFocusItem>
      </RovingFocusRoot>,
    );
    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(last);
  });

  it("supports Home, End, and locale-aware typeahead", () => {
    render(
      <RovingFocusRoot orientation="vertical">
        <RovingFocusItem as="button" textValue="Alpha">
          Alpha
        </RovingFocusItem>
        <RovingFocusItem as="button" textValue="Beta">
          Beta
        </RovingFocusItem>
        <RovingFocusItem as="button" textValue="Charlie">
          Charlie
        </RovingFocusItem>
      </RovingFocusRoot>,
    );
    const alpha = screen.getByRole("button", { name: "Alpha" });
    const beta = screen.getByRole("button", { name: "Beta" });
    const charlie = screen.getByRole("button", { name: "Charlie" });
    fireEvent.keyDown(alpha, { key: "End" });
    expect(document.activeElement).toBe(charlie);
    fireEvent.keyDown(charlie, { key: "Home" });
    expect(document.activeElement).toBe(alpha);
    fireEvent.keyDown(alpha, { key: "b" });
    expect(document.activeElement).toBe(beta);
  });

  it("owns RovingFocusRoot's data-orientation and dir, not overridable by the consumer", () => {
    render(
      <RovingFocusRoot data-orientation="vertical" dir="rtl" orientation="horizontal">
        <RovingFocusItem as="button">One</RovingFocusItem>
      </RovingFocusRoot>,
    );
    const root = screen.getByRole("button", { name: "One" }).parentElement;
    expect(root?.dataset.orientation).toBe("horizontal");
    expect(root?.getAttribute("dir")).toBe("ltr");
  });

  it("owns RovingFocusItem's aria-disabled/data-current/data-disabled, not overridable by the consumer", () => {
    render(
      <RovingFocusRoot orientation="horizontal">
        <RovingFocusItem
          as="button"
          disabled
          aria-disabled={false}
          data-current="fake"
          data-disabled="fake"
        >
          One
        </RovingFocusItem>
      </RovingFocusRoot>,
    );
    const one = screen.getByRole("button", { name: "One" });
    expect(one.getAttribute("aria-disabled")).toBe("true");
    expect(one.dataset.current).toBeUndefined();
    expect(one.dataset.disabled).toBe("");
  });

  it("owns RovingFocusItem's tabIndex — a consumer override never breaks the roving-tabindex pattern", () => {
    render(
      <RovingFocusRoot orientation="horizontal">
        <RovingFocusItem as="button" tabIndex={5}>
          One
        </RovingFocusItem>
        <RovingFocusItem as="button" tabIndex={5}>
          Two
        </RovingFocusItem>
      </RovingFocusRoot>,
    );
    const one = screen.getByRole("button", { name: "One" });
    const two = screen.getByRole("button", { name: "Two" });
    expect(one.tabIndex).toBe(0);
    expect(two.tabIndex).toBe(-1);
  });

  it("merges RovingFocusItem's three-way ref (internal element + consumer + store registration), cleaning up on unmount under StrictMode", () => {
    let lastSeen: HTMLElement | null | undefined;

    function Harness() {
      const consumerRef = useRef<HTMLElement | null>(null);
      const [mounted, setMounted] = useState(true);
      return (
        <RovingFocusRoot orientation="horizontal">
          {mounted && (
            <RovingFocusItem
              as="button"
              ref={(element: HTMLElement | null) => {
                consumerRef.current = element;
                lastSeen = element;
                return () => {
                  lastSeen = null;
                };
              }}
            >
              Item
            </RovingFocusItem>
          )}
          <RovingFocusItem as="button" onClick={() => setMounted(false)}>
            Unmount
          </RovingFocusItem>
        </RovingFocusRoot>
      );
    }
    Harness.displayName = "Harness";

    render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    expect(lastSeen).toBeInstanceOf(HTMLElement);

    fireEvent.click(screen.getByRole("button", { name: "Unmount" }));
    expect(lastSeen).toBeNull();
  });
});

describe("createRovingFocusStore", () => {
  it("notifies only the previous and next item subscribers on focus moves", () => {
    const store = createRovingFocusStore({
      direction: "ltr",
      loop: true,
      orientation: "horizontal",
    });
    const calls = Array.from({ length: 1000 }, () => 0);

    for (let index = 0; index < calls.length; index++) {
      store.register({
        disabled: false,
        element: null,
        id: String(index),
        textValue: String(index),
      });
      store.subscribeItem(String(index), () => {
        calls[index] = (calls[index] ?? 0) + 1;
      });
    }
    calls.fill(0);

    store.setCurrentId("1");

    expect(calls.reduce((total, count) => total + count, 0)).toBe(2);
    expect(calls[0]).toBe(1);
    expect(calls[1]).toBe(1);
  });

  it("accepts a Space character as a typeahead query without special-casing it away", () => {
    // Table.tsx's TableRow relies on this: RovingFocusItem's onKeyDown forwards
    // every non-Arrow/Home/End single character (including Space) to search(),
    // and TableRow's own Space-toggle only runs afterward if search() didn't
    // preventDefault (it never does) - so Space does double duty as both a
    // typeahead character and the row-toggle key. This pins that search()
    // treats Space as an ordinary, matchable query character, not a no-op.
    const store = createRovingFocusStore({
      direction: "ltr",
      loop: true,
      orientation: "vertical",
    });
    store.register({ disabled: false, element: null, id: "a", textValue: "Alpha" });
    store.register({ disabled: false, element: null, id: "b", textValue: " Beta" });
    store.setCurrentId("a");

    expect(() => store.search(" ")).not.toThrow();
    expect(store.getCurrentId()).toBe("b");
  });

  it("leaves off-axis arrow keys for composed handlers in a horizontal root", () => {
    render(
      <RovingFocusRoot orientation="horizontal">
        <RovingFocusItem as="button">One</RovingFocusItem>
        <RovingFocusItem as="button">Two</RovingFocusItem>
      </RovingFocusRoot>,
    );

    const first = screen.getByRole("button", { name: "One" });

    // fireEvent returns false when the handler called preventDefault().
    expect(fireEvent.keyDown(first, { key: "ArrowDown" })).toBe(true);
    expect(fireEvent.keyDown(first, { key: "ArrowUp" })).toBe(true);
    expect(fireEvent.keyDown(first, { key: "ArrowRight" })).toBe(false);
    expect(fireEvent.keyDown(first, { key: "Home" })).toBe(false);
  });
});

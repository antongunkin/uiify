import { act, fireEvent, render, screen } from "@testing-library/react";
import { Profiler } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TableOfContents } from "./index.js";
import type { TableOfContentsClientRootProps } from "../types.js";
let shown: WeakSet<Element>;
beforeEach(() => {
  shown = new WeakSet();
  vi.useFakeTimers();
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector) {
    return selector === ":popover-open" ? shown.has(this) : matches.call(this, selector);
  });
  const toggle = function (this: HTMLElement, next: boolean) {
    if (shown.has(this) === next) return;
    const before = new Event("beforetoggle", { cancelable: next });
    Object.defineProperty(before, "newState", { value: next ? "open" : "closed" });
    if (!this.dispatchEvent(before)) return;
    if (next) shown.add(this);
    else shown.delete(this);
    this.style.display = next ? "block" : "none";
    const event = new Event("toggle");
    Object.defineProperty(event, "newState", { value: next ? "open" : "closed" });
    this.dispatchEvent(event);
  };
  Object.defineProperty(HTMLElement.prototype, "showPopover", {
    configurable: true,
    value: function (this: HTMLElement) {
      toggle.call(this, true);
    },
  });
  Object.defineProperty(HTMLElement.prototype, "hidePopover", {
    configurable: true,
    value: function (this: HTMLElement) {
      toggle.call(this, false);
    },
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function Contents(props: TableOfContentsClientRootProps = {}) {
  return (
    <TableOfContents.Root aria-label="Contents" scrollSpy={false} {...props}>
      <TableOfContents.Trigger target="toc-test" aria-label="Open contents">
        <TableOfContents.Rail>
          <TableOfContents.Indicator value="intro" />
          <TableOfContents.Indicator value="setup" />
        </TableOfContents.Rail>
      </TableOfContents.Trigger>
      <TableOfContents.Content id="toc-test">
        <TableOfContents.List>
          <TableOfContents.Link href="#intro">Introduction</TableOfContents.Link>
          <TableOfContents.Link href="#setup">Setup</TableOfContents.Link>
        </TableOfContents.List>
      </TableOfContents.Content>
    </TableOfContents.Root>
  );
}
function enter(element: Element, pointerType = "mouse") {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(element, event);
}
function leave(element: Element) {
  const event = new Event("pointerout", { bubbles: true });
  Object.defineProperty(event, "relatedTarget", { value: document.body });
  fireEvent(element, event);
}
const root = () => screen.getByRole("navigation");
const trigger = () => screen.getByRole("button");
const panel = () => document.getElementById("toc-test")!;

describe("enhanced TableOfContents", () => {
  it("lets the browser expose native expanded state before hydration", () => {
    const html = renderToString(<Contents />);
    expect(html).toMatch(/popovertarget="toc-test"/i);
    expect(html).not.toContain("aria-expanded");
  });
  it("keeps controlled native dismissal synchronized after the close event", () => {
    const change = vi.fn();
    render(<Contents open onOpenChange={change} />);
    act(() => panel().hidePopover());
    act(() => vi.advanceTimersByTime(1));
    expect(change).toHaveBeenCalledWith(false);
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("opens at the hover delay and closes only after the leave delay", () => {
    render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(99));
    expect(root().getAttribute("data-state")).toBe("closed");
    act(() => vi.advanceTimersByTime(1));
    expect(panel().matches(":popover-open")).toBe(true);
    leave(trigger());
    act(() => vi.advanceTimersByTime(199));
    expect(panel().matches(":popover-open")).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(panel().matches(":popover-open")).toBe(false);
  });
  it("preserves a transient opening across consumer rerenders", () => {
    const { rerender } = render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    rerender(<Contents value="setup" />);
    fireEvent.click(trigger());
    leave(trigger());
    act(() => vi.advanceTimersByTime(300));
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("pins a hover opening on click and keeps it open when the pointer leaves", () => {
    render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    fireEvent.click(trigger());
    leave(trigger());
    act(() => vi.advanceTimersByTime(300));
    expect(panel().matches(":popover-open")).toBe(true);
    fireEvent.click(trigger());
    expect(panel().matches(":popover-open")).toBe(false);
  });
  it("cancels transient close when the pointer reaches the panel across a gap", () => {
    render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    leave(trigger());
    act(() => vi.advanceTimersByTime(100));
    enter(panel());
    act(() => vi.advanceTimersByTime(200));
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("keeps focus inside the panel safe from hover leave", () => {
    render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    act(() => screen.getByRole("link", { name: "Setup", hidden: true }).focus());
    leave(trigger());
    act(() => vi.advanceTimersByTime(300));
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("suppresses reopening after native Escape dismissal until pointer re-entry", () => {
    render(<Contents />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    act(() => panel().hidePopover());
    act(() => vi.advanceTimersByTime(300));
    expect(panel().matches(":popover-open")).toBe(false);
    leave(trigger());
    enter(trigger());
    act(() => vi.advanceTimersByTime(100));
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("does not open for touch or when hover is disabled", () => {
    const { rerender } = render(<Contents />);
    enter(trigger(), "touch");
    act(() => vi.advanceTimersByTime(200));
    expect(panel().matches(":popover-open")).toBe(false);
    rerender(<Contents openOnHover={false} />);
    enter(trigger());
    act(() => vi.advanceTimersByTime(200));
    expect(panel().matches(":popover-open")).toBe(false);
  });
  it("respects controlled null and false while emitting requests", () => {
    const change = vi.fn();
    render(<Contents value={null} open={false} onOpenChange={change} />);
    fireEvent.click(trigger());
    expect(change).toHaveBeenCalledWith(true);
    expect(panel().matches(":popover-open")).toBe(false);
    expect(root().querySelectorAll("[data-selected]")).toHaveLength(0);
  });
  it("synchronizes selection for encoded fragment IDs and updates both parts", () => {
    const { rerender } = render(<Contents value="setup" />);
    expect(
      screen.getByRole("link", { name: "Setup", hidden: true }).getAttribute("aria-current"),
    ).toBe("location");
    expect(root().querySelectorAll('[data-part="indicator"][data-selected]')).toHaveLength(1);
    rerender(<Contents value="intro" />);
    expect(
      screen.getByRole("link", { name: "Introduction", hidden: true }).getAttribute("aria-current"),
    ).toBe("location");
    expect(
      screen.getByRole("link", { name: "Setup", hidden: true }).getAttribute("aria-current"),
    ).toBe(null);
  });
  it("preserves prevented and modified clicks and closes on normal navigation", () => {
    const { rerender } = render(
      <Contents defaultOpen onClick={(event) => event.preventDefault()} />,
    );
    fireEvent.click(screen.getByRole("link", { name: "Setup", hidden: true }));
    expect(panel().matches(":popover-open")).toBe(true);
    rerender(<Contents defaultOpen />);
    fireEvent.click(screen.getByRole("link", { name: "Setup", hidden: true }), { ctrlKey: true });
    expect(panel().matches(":popover-open")).toBe(true);
    fireEvent.click(screen.getByRole("link", { name: "Setup", hidden: true }));
    expect(panel().matches(":popover-open")).toBe(false);
  });
  it("leaves native consumer link cancellation intact", () => {
    render(
      <TableOfContents.Root scrollSpy={false} defaultOpen>
        <TableOfContents.Trigger target="toc-test">Contents</TableOfContents.Trigger>
        <TableOfContents.Content id="toc-test">
          <TableOfContents.Link href="#intro" onClick={(event) => event.preventDefault()}>
            Introduction
          </TableOfContents.Link>
        </TableOfContents.Content>
      </TableOfContents.Root>,
    );
    fireEvent.click(screen.getByRole("link"));
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("follows a highlighted line by mouse while touch opens the contents", () => {
    render(<Contents />);
    const indicator = root().querySelector('[data-part="indicator"]')!;
    indicator.setAttribute("data-highlighted", "");
    const link = screen.getByRole("link", { name: "Introduction", hidden: true });
    const click = vi.spyOn(link, "click");
    fireEvent.click(indicator, { detail: 1 });
    expect(click).toHaveBeenCalledTimes(1);
    const event = new MouseEvent("click", { bubbles: true, detail: 1 });
    Object.defineProperty(event, "pointerType", { value: "touch" });
    fireEvent(indicator, event);
    expect(click).toHaveBeenCalledTimes(1);
    expect(panel().matches(":popover-open")).toBe(true);
  });
  it("cancels pending hover timers on unmount and does not commit React for pointer moves", () => {
    const commit = vi.fn();
    const { unmount } = render(
      <Profiler id="toc" onRender={commit}>
        <Contents openOnHover={false} />
      </Profiler>,
    );
    commit.mockClear();
    fireEvent.pointerMove(trigger(), { clientY: 20 });
    fireEvent.pointerMove(trigger(), { clientY: 40 });
    act(() => vi.advanceTimersByTime(20));
    expect(commit).not.toHaveBeenCalled();
    unmount();
    act(() => vi.runAllTimers());
    expect(document.querySelector("nav")).toBe(null);
  });
});

Contents.displayName = "Contents";

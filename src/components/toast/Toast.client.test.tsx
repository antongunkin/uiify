import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Toast, useToast } from "./Toast.js";

// jsdom does not implement the Popover API — stub it the same way
// components/enhance/invoker-fallback.test.ts and tooltip/Tooltip.test.tsx do,
// so the viewport's show/hide wiring is observable instead of silently caught.
const showPopover = vi.fn();
const hidePopover = vi.fn();

beforeAll(() => {
  // jsdom has no CSS namespace; React escapes <ViewTransition> names with
  // CSS.escape while committing, which every supported browser provides.
  vi.stubGlobal("CSS", { escape: (value: string) => value });
  for (const [name, value] of [
    ["showPopover", showPopover],
    ["hidePopover", hidePopover],
  ] as const) {
    Object.defineProperty(HTMLElement.prototype, name, { configurable: true, value });
  }
});

function ToastHarness() {
  const { toast } = useToast();
  return (
    <>
      <button type="button" onClick={() => toast({ title: "Saved", duration: 4000 })}>
        Show toast
      </button>
      <Toast.Viewport />
    </>
  );
}
ToastHarness.displayName = "ToastHarness";

function ToastPartsHarness() {
  const { toast } = useToast();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toast({
            title: "Saved",
            description: "Profile updated",
            duration: 0,
            action: { label: "Undo", onClick: vi.fn() },
          })
        }
      >
        Show parts
      </button>
      <Toast.Viewport />
    </>
  );
}
ToastPartsHarness.displayName = "ToastPartsHarness";

function dispatchPointer(
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  init: {
    clientX?: number;
    clientY?: number;
    isPrimary: boolean;
    pointerId: number;
  },
) {
  const event = new Event(type, { bubbles: true });
  for (const [key, value] of Object.entries(init)) {
    Object.defineProperty(event, key, { configurable: true, value });
  }
  act(() => target.dispatchEvent(event));
}

describe("Toast client", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    showPopover.mockClear();
    hidePopover.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("enqueues a toast and announces it", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(document.querySelector("[aria-live='polite']")?.textContent).toContain("Saved");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("passes provider label overrides to the live viewport and generated toast controls", () => {
    function UntitledToastHarness() {
      const { toast } = useToast();
      return (
        <>
          <button type="button" onClick={() => toast({ duration: 0 })}>
            Show untitled
          </button>
          <Toast.Viewport />
        </>
      );
    }
    UntitledToastHarness.displayName = "UntitledToastHarness";

    render(
      <Toast.Provider labels={{ region: "Alertes", notification: "Notification", close: "Fermer" }}>
        <UntitledToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show untitled" }));
    expect(screen.getByTestId("toast-viewport").getAttribute("aria-label")).toBe("Alertes");
    const viewport = screen.getByTestId("toast-viewport");
    expect(viewport.querySelector('[data-part="item"]')?.getAttribute("aria-label")).toBe(
      "Notification",
    );
    expect(viewport.querySelector('[data-part="close"]')?.getAttribute("aria-label")).toBe(
      "Fermer",
    );
  });

  it("marks every public toast part in the client entry", () => {
    render(
      <Toast.Provider>
        <ToastPartsHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show parts" }));

    expect(screen.getByText("Saved").getAttribute("data-part")).toBe("title");
    expect(screen.getByText("Profile updated").getAttribute("data-part")).toBe("description");
    expect(
      screen.getByRole("button", { name: "Undo", hidden: true }).getAttribute("data-part"),
    ).toBe("action");
    expect(
      screen.getByRole("button", { name: "Close", hidden: true }).getAttribute("data-part"),
    ).toBe("close");
  });

  it("auto-dismisses after duration", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("dismisses from Close and respects queue limit", () => {
    function MultiToastHarness() {
      const { toast } = useToast();
      return (
        <>
          <button
            type="button"
            onClick={() => {
              toast({ title: "One", duration: 0 });
              toast({ title: "Two", duration: 0 });
              toast({ title: "Three", duration: 0 });
              toast({ title: "Four", duration: 0 });
            }}
          >
            Flood
          </button>
          <Toast.Viewport />
        </>
      );
    }
    MultiToastHarness.displayName = "MultiToastHarness";

    render(
      <Toast.Provider limit={3}>
        <MultiToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flood" }));
    expect(screen.queryByText("One")).toBeNull();
    expect(screen.getByText("Four")).toBeTruthy();
  });

  it("dismisses on swipe threshold using pointer deltas", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const toast = screen
      .getByRole("button", { name: "Close", hidden: true })
      .closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");
    dispatchPointer(toast, "pointerdown", {
      clientX: 0,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    dispatchPointer(toast, "pointermove", {
      clientX: 100,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("ignores secondary pointers while tracking the primary swipe origin", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const toast = screen
      .getByRole("button", { name: "Close", hidden: true })
      .closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");

    dispatchPointer(toast, "pointerdown", {
      clientX: 0,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    dispatchPointer(toast, "pointerdown", {
      clientX: 80,
      clientY: 0,
      isPrimary: false,
      pointerId: 2,
    });
    dispatchPointer(toast, "pointermove", {
      clientX: 170,
      clientY: 0,
      isPrimary: false,
      pointerId: 2,
    });

    expect(screen.getByText("Saved")).toBeTruthy();

    dispatchPointer(toast, "pointermove", {
      clientX: 90,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it.each(["pointerup", "pointercancel"] as const)("resets swipe tracking on %s", (type) => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const toast = screen
      .getByRole("button", { name: "Close", hidden: true })
      .closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");

    dispatchPointer(toast, "pointerdown", {
      clientX: 0,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    dispatchPointer(toast, type, { isPrimary: true, pointerId: 1 });
    dispatchPointer(toast, "pointermove", {
      clientX: 100,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    expect(screen.getByText("Saved")).toBeTruthy();

    dispatchPointer(toast, "pointerdown", {
      clientX: 200,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    dispatchPointer(toast, "pointermove", {
      clientX: 290,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });

    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("does not dismiss on a vertical pointer gesture", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const toast = screen
      .getByRole("button", { name: "Close", hidden: true })
      .closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");

    dispatchPointer(toast, "pointerdown", {
      clientX: 0,
      clientY: 0,
      isPrimary: true,
      pointerId: 1,
    });
    dispatchPointer(toast, "pointermove", {
      clientX: 0,
      clientY: 100,
      isPrimary: true,
      pointerId: 1,
    });

    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("pauses while focused and resumes the remaining duration", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => vi.advanceTimersByTime(1000));
    const close = screen.getByRole("button", { name: "Close", hidden: true });
    fireEvent.focus(close);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("Saved")).toBeTruthy();

    fireEvent.blur(close);
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByText("Saved")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("stays paused when the pointer leaves while Close remains focused", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => vi.advanceTimersByTime(1000));
    const close = screen.getByRole("button", { name: "Close", hidden: true });
    const toast = close.closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");

    fireEvent.pointerEnter(toast);
    close.focus();
    fireEvent.pointerLeave(toast);
    act(() => vi.advanceTimersByTime(5000));

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(document.activeElement).toBe(close);

    screen.getByRole("button", { name: "Show toast" }).focus();
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByText("Saved")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("stays paused when focus leaves while the pointer remains over the toast", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => vi.advanceTimersByTime(1000));
    const close = screen.getByRole("button", { name: "Close", hidden: true });
    const toast = close.closest("[data-state='open']");
    if (!toast) throw new Error("Expected toast root");

    close.focus();
    let hovered = false;
    const nativeMatches = toast.matches.bind(toast);
    const matches = vi
      .spyOn(toast, "matches")
      .mockImplementation((selector) =>
        selector === ":hover, :focus-within" ? hovered : nativeMatches(selector),
      );
    fireEvent.pointerEnter(toast);
    hovered = true;
    screen.getByRole("button", { name: "Show toast" }).focus();
    act(() => vi.advanceTimersByTime(5000));

    expect(screen.getByText("Saved")).toBeTruthy();

    fireEvent.pointerLeave(toast);
    hovered = false;
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByText("Saved")).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Saved")).toBeNull();
    matches.mockRestore();
  });

  it("dismisses the focused toast on Escape", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const close = screen.getByRole("button", { name: "Close", hidden: true });
    close.focus();
    fireEvent.keyDown(close, { key: "Escape" });

    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("updates the stable live region for repeated identical messages", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );
    const liveRegion = document.querySelector("[aria-live='polite']");

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const firstAnnouncement = liveRegion?.textContent;
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));

    expect(liveRegion?.textContent).not.toBe(firstAnnouncement);
    expect(liveRegion?.textContent).toContain("Saved");
  });

  it("calls showPopover on the viewport when the queue gains its first toast", () => {
    // jsdom's Element.matches(":popover-open") always reports false (no real
    // Popover API implementation), so the hidePopover guard
    // (`viewport.matches(":popover-open")`) can never observe a "was open"
    // state to hide from — the hide direction is only verifiable in a real
    // browser (see e2e/specs/top-layer.spec.ts). This test covers the one
    // direction jsdom can actually exercise.
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    expect(showPopover).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(showPopover).toHaveBeenCalledTimes(1);
  });

  it("keeps the two live-region announcers outside the popover-bearing viewport", () => {
    render(
      <Toast.Provider>
        <ToastHarness />
      </Toast.Provider>,
    );

    const viewport = screen.getByTestId("toast-viewport");
    expect(viewport.getAttribute("popover")).toBe("manual");
    const politeRegion = document.querySelector("[aria-live='polite']");
    const assertiveRegion = document.querySelector("[aria-live='assertive']");
    expect(politeRegion).not.toBeNull();
    expect(assertiveRegion).not.toBeNull();
    expect(viewport.contains(politeRegion)).toBe(false);
    expect(viewport.contains(assertiveRegion)).toBe(false);
  });
});

it("keeps the enqueue owner within its render budget", () => {
  let providerRenders = 0;
  function Harness() {
    providerRenders++;
    const { toast } = useToast();
    return (
      <>
        <button onClick={() => toast({ title: "Saved" })} type="button">
          Show
        </button>
        <Toast.Viewport />
      </>
    );
  }
  Harness.displayName = "Harness";

  render(
    <Toast.Provider>
      <Harness />
    </Toast.Provider>,
  );
  providerRenders = 0;
  fireEvent.click(screen.getByRole("button", { name: "Show" }));
  expect(providerRenders).toBeLessThanOrEqual(2);
});

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderClient } from "./HeaderClient.js";

let resize: ResizeObserverCallback;
let frame: FrameRequestCallback | undefined;
let position: number;
const disconnect = vi.fn();
const cancelFrame = vi.fn();

beforeEach(() => {
  position = 0;
  frame = undefined;
  vi.spyOn(window, "scrollY", "get").mockImplementation(() => position);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frame = callback;
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(cancelFrame);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function measure(height = 100): void {
  act(() =>
    resize(
      [
        {
          target: screen.getByRole("banner"),
          borderBoxSize: [{ blockSize: height, inlineSize: 500 }],
          contentBoxSize: [{ blockSize: height, inlineSize: 500 }],
          devicePixelContentBoxSize: [{ blockSize: height, inlineSize: 500 }],
          contentRect: new DOMRectReadOnly(0, 0, 500, height),
        },
      ],
      {} as ResizeObserver,
    ),
  );
}

function scroll(value: number, target: Window | HTMLElement = window, flush = true): void {
  if (target === window) position = value;
  else (target as HTMLElement).scrollTop = value;
  fireEvent.scroll(target);
  if (flush) flushFrame();
}

function flushFrame(): void {
  const callback = frame;
  frame = undefined;
  act(() => callback?.(0));
}

function state(): string | null {
  return screen.getByRole("banner").getAttribute("data-state");
}

function scrollport(id: string): HTMLElement {
  const target = document.createElement("div");
  target.id = id;
  document.body.append(target);
  return target;
}

describe("HeaderClient", () => {
  it("renders visible top markup on the server with sticky placement", () => {
    const html = renderToString(
      <HeaderClient>
        <a href="/docs">Docs</a>
      </HeaderClient>,
    );
    expect(html).toContain('data-state="top"');
    expect(html).toContain('data-placement="sticky"');
    expect(html).toContain('data-uiify-header=""');
    expect(html).toContain('href="/docs"');
  });

  it("owns identity, placement and state while forwarding native props and object ref", () => {
    const ref = createRef<HTMLElement>();
    const click = vi.fn();
    render(
      <HeaderClient
        ref={ref}
        id="header"
        aria-label="Site"
        className="custom"
        style={{ color: "red" }}
        data-consumer="value"
        onClick={click}
        data-uiify-header="fake"
        data-placement="fake"
        data-state="hidden"
      />,
    );
    const root = screen.getByRole("banner", { name: "Site" });
    expect(ref.current).toBe(root);
    expect(root.id).toBe("header");
    expect(root.className).toBe("custom");
    expect(root.style.color).toBe("red");
    expect(root.getAttribute("data-consumer")).toBe("value");
    expect(root.getAttribute("data-uiify-header")).toBe("");
    expect(root.getAttribute("data-placement")).toBe("sticky");
    expect(state()).toBe("top");
    fireEvent.click(root);
    expect(click).toHaveBeenCalledOnce();
  });

  it("runs callback ref cleanup on unmount", () => {
    const release = vi.fn();
    const ref = vi.fn(() => release);
    const { unmount } = render(<HeaderClient ref={ref} />);
    expect(ref).toHaveBeenCalledWith(screen.getByRole("banner"));
    unmount();
    expect(release).toHaveBeenCalledOnce();
  });

  it("starts visible at a restored position and waits for new downward movement", () => {
    position = 300;
    render(<HeaderClient />);
    measure();
    expect(state()).toBe("visible");
    scroll(307);
    expect(state()).toBe("visible");
    scroll(308);
    expect(state()).toBe("hidden");
  });

  it("waits until passing the complete header height", () => {
    render(<HeaderClient />);
    measure(160);
    scroll(100);
    expect(state()).toBe("visible");
    scroll(160);
    expect(state()).toBe("visible");
    scroll(161);
    expect(state()).toBe("hidden");
  });

  it("uses updated observer height without measuring during scroll", () => {
    render(<HeaderClient />);
    measure(200);
    scroll(150);
    expect(state()).toBe("visible");
    measure(100);
    scroll(160);
    expect(state()).toBe("hidden");
  });

  it("accumulates 8 px, resets on reversal, and reveals after sustained upward movement", () => {
    position = 200;
    render(<HeaderClient />);
    measure();
    scroll(205);
    scroll(203);
    scroll(208);
    expect(state()).toBe("visible");
    scroll(211);
    expect(state()).toBe("hidden");
    scroll(207);
    expect(state()).toBe("hidden");
    scroll(203);
    expect(state()).toBe("visible");
  });

  it("reveals immediately at zero and clamps negative overscroll", () => {
    render(<HeaderClient />);
    measure();
    scroll(200);
    expect(state()).toBe("hidden");
    scroll(-10);
    expect(state()).toBe("top");
    scroll(-3);
    expect(state()).toBe("top");
    scroll(5);
    expect(state()).toBe("visible");
  });

  it("coalesces scroll events into one frame and reads the latest position", () => {
    render(<HeaderClient />);
    measure();
    scroll(200, window, false);
    scroll(220, window, false);
    expect(window.requestAnimationFrame).toHaveBeenCalledOnce();
    expect(state()).toBe("top");
    flushFrame();
    expect(state()).toBe("hidden");
  });

  it("attaches one passive window scroll listener", () => {
    const listener = vi.spyOn(window, "addEventListener");
    render(<HeaderClient />);
    expect(listener.mock.calls.filter(([name]) => name === "scroll")).toEqual([
      ["scroll", expect.any(Function), { passive: true }],
    ]);
  });

  it("resolves targets and schedules frames in the header's owning document", () => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const doc = iframe.contentDocument!;
    const view = doc.defaultView!;
    Object.defineProperty(view, "ResizeObserver", { value: window.ResizeObserver });
    vi.spyOn(view, "requestAnimationFrame").mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    const target = doc.createElement("div");
    target.id = "own-preview";
    doc.body.append(target);
    const { container, unmount } = render(<HeaderClient scrollTarget="own-preview" />, {
      container: doc.body.appendChild(doc.createElement("div")),
    });
    const header = container.querySelector("header")!;
    act(() =>
      resize(
        [
          {
            target: header,
            borderBoxSize: [{ blockSize: 100, inlineSize: 500 }],
            contentBoxSize: [{ blockSize: 100, inlineSize: 500 }],
            devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 500 }],
            contentRect: new DOMRectReadOnly(0, 0, 500, 100),
          },
        ],
        {} as ResizeObserver,
      ),
    );
    scroll(200, target);
    expect(header.getAttribute("data-state")).toBe("hidden");
    expect(view.requestAnimationFrame).toHaveBeenCalledOnce();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    unmount();
    iframe.remove();
  });

  it("waits for observer height and never reads synchronous layout during scroll", () => {
    render(<HeaderClient />);
    const read = vi.spyOn(screen.getByRole("banner"), "getBoundingClientRect");
    scroll(200);
    expect(state()).toBe("visible");
    measure();
    scroll(220);
    expect(state()).toBe("hidden");
    expect(read).not.toHaveBeenCalled();
  });

  it("uses an id scrollport instead of the window", () => {
    const target = scrollport("preview");
    target.scrollTop = 200;
    render(<HeaderClient scrollTarget="preview" />);
    measure();
    expect(state()).toBe("visible");
    scroll(300);
    expect(state()).toBe("visible");
    scroll(208, target);
    expect(state()).toBe("hidden");
    scroll(0, target);
    expect(state()).toBe("top");
    target.remove();
  });

  it("keeps a missing id target visible without falling back to window", () => {
    const listener = vi.spyOn(window, "addEventListener");
    render(<HeaderClient scrollTarget="absent" />);
    scroll(300);
    expect(state()).toBe("top");
    expect(listener.mock.calls.filter(([name]) => name === "scroll")).toEqual([]);
  });

  it.each([{ hideOnScroll: false }, { placement: "static" as const }])(
    "tracks top and visible without hiding while disabled: %s",
    (props) => {
      const listener = vi.spyOn(window, "addEventListener");
      render(<HeaderClient {...props} />);
      expect(state()).toBe("top");
      scroll(300);
      expect(state()).toBe("visible");
      scroll(600);
      expect(state()).toBe("visible");
      scroll(0);
      expect(state()).toBe("top");
      scroll(-10);
      expect(state()).toBe("top");
      expect(listener.mock.calls.filter(([name]) => name === "scroll")).toEqual([
        ["scroll", expect.any(Function), { passive: true }],
      ]);
    },
  );

  it.each([{ hideOnScroll: false }, { placement: "static" as const }])(
    "tracks return to zero from a restored offset while disabled: %s",
    (props) => {
      position = 300;
      render(<HeaderClient {...props} />);
      expect(state()).toBe("visible");
      scroll(0);
      expect(state()).toBe("top");
      scroll(200);
      expect(state()).toBe("visible");
    },
  );

  it("focus within reveals immediately and protects the header until focus leaves", () => {
    render(
      <>
        <HeaderClient>
          <button>Menu</button>
        </HeaderClient>
        <button>Outside</button>
      </>,
    );
    measure();
    scroll(200);
    expect(state()).toBe("hidden");
    act(() => screen.getByRole("button", { name: "Menu" }).focus());
    expect(state()).toBe("visible");
    scroll(220);
    expect(state()).toBe("visible");
    act(() => screen.getByRole("button", { name: "Outside" }).focus());
    scroll(240);
    expect(state()).toBe("hidden");
  });

  it.each(["dialog", "details"])(
    "an open descendant %s reveals and protects the header",
    async (tag) => {
      render(
        <HeaderClient>
          {tag === "dialog" ? (
            <dialog>Menu</dialog>
          ) : (
            <details>
              <summary>Menu</summary>
            </details>
          )}
        </HeaderClient>,
      );
      measure();
      scroll(200);
      expect(state()).toBe("hidden");
      const descendant = screen.getByRole("banner").querySelector(tag)!;
      await act(async () => {
        descendant.setAttribute("open", "");
      });
      expect(state()).toBe("visible");
      scroll(220);
      expect(state()).toBe("visible");
      await act(async () => {
        descendant.removeAttribute("open");
      });
      scroll(240);
      expect(state()).toBe("hidden");
    },
  );

  it("native popover toggle reveals and protects while open", () => {
    render(
      <HeaderClient>
        <div popover="auto">Menu</div>
      </HeaderClient>,
    );
    const popover = screen.getByText("Menu");
    // jsdom has no native popover state; supply only that browser selector result.
    const query = screen.getByRole("banner").querySelector.bind(screen.getByRole("banner"));
    let open = false;
    vi.spyOn(screen.getByRole("banner"), "querySelector").mockImplementation((selector) =>
      selector.includes(":popover-open")
        ? open
          ? popover
          : query("dialog[open], details[open]")
        : query(selector),
    );
    measure();
    scroll(200);
    expect(state()).toBe("hidden");
    open = true;
    fireEvent(popover, new Event("toggle"));
    expect(state()).toBe("visible");
    scroll(220);
    expect(state()).toBe("visible");
    open = false;
    fireEvent(popover, new Event("toggle"));
    scroll(240);
    expect(state()).toBe("hidden");
  });

  it("changing options reveals and resets scroll history", () => {
    const { rerender } = render(<HeaderClient />);
    measure();
    scroll(200);
    expect(state()).toBe("hidden");
    rerender(<HeaderClient hideOnScroll={false} />);
    expect(state()).toBe("visible");
    scroll(0);
    expect(state()).toBe("top");
    scroll(200);
    expect(state()).toBe("visible");
    rerender(<HeaderClient />);
    measure();
    scroll(207);
    expect(state()).toBe("visible");
    scroll(208);
    expect(state()).toBe("hidden");
    rerender(<HeaderClient placement="static" />);
    expect(state()).toBe("visible");
    scroll(0);
    expect(state()).toBe("top");
  });

  it("changing targets resets history and detaches the old target", () => {
    const first = scrollport("first");
    const second = scrollport("second");
    second.scrollTop = 300;
    const { rerender } = render(<HeaderClient scrollTarget="first" />);
    measure();
    scroll(200, first);
    expect(state()).toBe("hidden");
    rerender(<HeaderClient scrollTarget="second" />);
    measure();
    expect(state()).toBe("visible");
    scroll(400, first);
    expect(frame).toBeUndefined();
    scroll(307, second);
    expect(state()).toBe("visible");
    scroll(308, second);
    expect(state()).toBe("hidden");
    first.remove();
    second.remove();
  });

  it.each([{}, { hideOnScroll: false }, { placement: "static" as const }])(
    "cleans observers, listeners and pending frames: %s",
    (props) => {
      const remove = vi.spyOn(window, "removeEventListener");
      const { unmount } = render(<HeaderClient {...props} />);
      measure();
      scroll(200, window, false);
      unmount();
      expect(disconnect).toHaveBeenCalledOnce();
      expect(cancelFrame).toHaveBeenCalledWith(1);
      expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
      frame = undefined;
      scroll(300, window, false);
      expect(frame).toBeUndefined();
    },
  );
});

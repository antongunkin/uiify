import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import {
  computeActiveVirtualScrollSlotCount,
  computeVirtualScrollSlotCount,
} from "./VirtualScrollRowShell.js";
import { VirtualScroll } from "./VirtualScroll.js";
import { supportsScrollEndEvent } from "./virtual-scroll-scroll-state.js";
import type { VirtualScrollItem } from "./types.js";
import { VIRTUAL_SCROLL_OVERSCAN, VIRTUAL_SCROLL_ROW_HEIGHT } from "./types.js";

interface Song extends VirtualScrollItem {
  readonly title: string;
}

function createSongs(count: number): Song[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    title: `Song ${index + 1}`,
  }));
}

function renderSongList(
  items: Song[],
  options: {
    readonly height?: number;
    readonly rowHeight?: number;
    readonly overscan?: number;
    readonly className?: string;
    readonly testId?: string;
    readonly renderRow?: (song: Song, index: number) => React.ReactNode;
  } = {},
) {
  const renderRow =
    options.renderRow ?? ((song) => <span data-testid={`title-${song.id}`}>{song.title}</span>);

  return render(
    <VirtualScroll
      height={options.height ?? 600}
      items={items}
      renderRow={renderRow}
      {...(options.className ? { className: options.className } : {})}
      {...(options.overscan !== undefined ? { overscan: options.overscan } : {})}
      {...(options.rowHeight !== undefined ? { rowHeight: options.rowHeight } : {})}
      {...(options.testId ? { testId: options.testId } : {})}
    />,
  );
}

function getViewport(container: HTMLElement): HTMLDivElement {
  return container.querySelector("[data-uiify-virtual-scroll]") as HTMLDivElement;
}

function getSpacer(container: HTMLElement): HTMLDivElement {
  return container.querySelector('[data-part="spacer"]') as HTMLDivElement;
}

async function flushScrollSync(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

async function scrollViewport(viewport: HTMLDivElement, scrollTop: number): Promise<void> {
  await act(async () => {
    viewport.scrollTop = scrollTop;
    fireEvent.scroll(viewport);
  });
}

/** Scroll jump without extra rAF waits — reproduces scrollbar / Cmd+Arrow jumps. */
async function jumpScrollViewport(viewport: HTMLDivElement, scrollTop: number): Promise<void> {
  await act(async () => {
    viewport.scrollTop = scrollTop;
    fireEvent.scroll(viewport);
  });
}

function resizeEntry(element: Element, height: number): ResizeObserverEntry {
  return {
    borderBoxSize: [],
    contentBoxSize: [],
    contentRect: {
      bottom: height,
      height,
      left: 0,
      right: 800,
      top: 0,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    },
    devicePixelContentBoxSize: [],
    target: element,
  };
}

function stubResizeObserver(initialHeight = 600): {
  readonly observe: ReturnType<typeof vi.fn>;
  readonly unobserve: ReturnType<typeof vi.fn>;
  readonly disconnect: ReturnType<typeof vi.fn>;
  readonly trigger: (element: Element, height: number) => void;
} {
  let callback: ResizeObserverCallback | undefined;
  const observe = vi.fn((element: Element) => {
    callback?.([resizeEntry(element, initialHeight)], {} as ResizeObserver);
  });
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class ResizeObserverMock {
    constructor(next: ResizeObserverCallback) {
      callback = next;
    }

    observe(element: Element): void {
      observe(element);
    }

    // React calls unobserve per child when a <Fragment ref> child unmounts
    // (deleteChildFromFragmentInstance), so the double must implement it.
    unobserve(element: Element): void {
      unobserve(element);
    }

    disconnect(): void {
      disconnect();
    }
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);

  return {
    observe,
    unobserve,
    disconnect,
    trigger(element: Element, height: number) {
      callback?.([resizeEntry(element, height)], {} as ResizeObserver);
    },
  };
}

describe("computeVirtualScrollSlotCount", () => {
  it("matches visible rows plus overscan buffer", () => {
    expect(computeVirtualScrollSlotCount(600, 64, 5)).toBe(
      Math.ceil(600 / 64) + VIRTUAL_SCROLL_OVERSCAN * 2,
    );
  });
});

describe("computeActiveVirtualScrollSlotCount", () => {
  it("returns full slot count when the range is away from the list tail", () => {
    expect(computeActiveVirtualScrollSlotCount(10_000, 500, 20)).toBe(20);
  });

  it("clamps slots so indices never exceed itemCount", () => {
    expect(computeActiveVirtualScrollSlotCount(10_000, 9994, 20)).toBe(6);
  });
});

describe("VirtualScroll", () => {
  it("renders only the visible window plus overscan rows", () => {
    renderSongList(createSongs(10_000));

    const renderedRows = document.querySelectorAll('[data-part="row"]');
    const visibleInWindow = Math.ceil(600 / VIRTUAL_SCROLL_ROW_HEIGHT);
    const expectedMax = visibleInWindow + VIRTUAL_SCROLL_OVERSCAN * 2;

    expect(renderedRows.length).toBeLessThanOrEqual(expectedMax);
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(100);
  });

  it("sets --uiify-range-start on the spacer and static --uiify-slot-index on rows", () => {
    const items = createSongs(100);
    const { container } = renderSongList(items);

    expect(getSpacer(container).style.getPropertyValue("--uiify-range-start")).toBe("0");

    const firstRow = container.querySelector('[data-part="row"]') as HTMLDivElement;
    expect(firstRow.style.getPropertyValue("--uiify-slot-index")).toBe("0");
    expect(firstRow.style.getPropertyValue("--uiify-row-index")).toBe("");
  });

  it("updates visible rows immediately after a single-row scroll step", async () => {
    const items = createSongs(10_000);
    const { container } = renderSongList(items);
    const viewport = getViewport(container);

    await flushScrollSync();
    await jumpScrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 11);

    expect(screen.getByTestId("title-12")).toBeTruthy();
    expect(screen.queryByTestId("title-1")).toBeNull();
  });

  it("updates visible rows immediately after a large scroll jump", async () => {
    const items = createSongs(10_000);
    const { container } = renderSongList(items);
    const viewport = getViewport(container);

    await flushScrollSync();
    const targetScrollTop = VIRTUAL_SCROLL_ROW_HEIGHT * 500;
    await jumpScrollViewport(viewport, targetScrollTop);

    expect(screen.queryByTestId("title-1")).toBeNull();
    expect(screen.getByTestId("title-501")).toBeTruthy();
    expect(getSpacer(container).style.getPropertyValue("--uiify-range-start")).toBe("495");
  });

  it("updates visible rows immediately after scrollToIndex", async () => {
    const handle = {
      current: null as import("./types.js").VirtualScrollHandle | null,
    };
    const items = createSongs(10_000);
    render(
      <VirtualScroll
        height={600}
        items={items}
        scrollRef={handle}
        renderRow={(song) => <span data-testid={`title-${song.id}`}>{song.title}</span>}
      />,
    );

    await act(async () => {
      handle.current?.scrollToIndex(500, { align: "start", behavior: "instant" });
    });

    expect(screen.getByTestId("title-501")).toBeTruthy();
    expect(screen.queryByTestId("title-1")).toBeNull();
  });

  it("keeps --uiify-slot-index stable and updates --uiify-range-start when the range changes", async () => {
    const items = createSongs(200);
    const { container } = renderSongList(items);

    const viewport = getViewport(container);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10);

    const firstRow = container.querySelector('[data-part="row"]') as HTMLDivElement;
    expect(firstRow.style.getPropertyValue("--uiify-slot-index")).toBe("0");
    expect(getSpacer(container).style.getPropertyValue("--uiify-range-start")).toBe("5");
  });

  it("sets CSS variables for spacer height on the scrollport", () => {
    const items = createSongs(100);
    const { container } = renderSongList(items);
    const scrollport = getViewport(container);

    expect(scrollport.style.getPropertyValue("--uiify-virtual-scroll-count")).toBe("100");
    expect(scrollport.style.getPropertyValue("--uiify-virtual-scroll-row-height")).toBe("64px");
  });

  it("keeps stable slot count when scrolled", async () => {
    const { container } = renderSongList(createSongs(200));
    const viewport = getViewport(container);

    const countBefore = container.querySelectorAll('[data-part="row"]').length;
    expect(countBefore).toBeGreaterThan(0);

    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10);

    expect(container.querySelectorAll('[data-part="row"]').length).toBe(countBefore);
  });

  it("does not re-render rows when scroll stays within the same visible range", async () => {
    const observer = stubResizeObserver(600);
    const counter = createRenderCounter();
    const items = createSongs(500);
    const { container } = render(
      <counter.Wrapper>
        <VirtualScroll height={600} items={items} renderRow={(song) => <span>{song.title}</span>} />
      </counter.Wrapper>,
    );
    const viewport = getViewport(container);

    await act(async () => {
      observer.trigger(viewport, 600);
      await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10);
    });

    counter.reset();

    await act(async () => {
      await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10 + 10);
      await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10 + 40);
    });

    expect(counter.getCommitCount()).toBe(0);
    vi.unstubAllGlobals();
  });

  it("re-renders when scroll crosses into a new visible range", async () => {
    const counter = createRenderCounter();
    const items = createSongs(500);

    const { container } = render(
      <counter.Wrapper>
        <VirtualScroll height={600} items={items} renderRow={(song) => <span>{song.title}</span>} />
      </counter.Wrapper>,
    );

    counter.reset();
    const viewport = getViewport(container);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 11);

    expect(counter.getCommitCount()).toBeGreaterThan(0);
  });

  it("keys rows by item id and swaps content when scrolled", async () => {
    const items = createSongs(200);
    const { container } = renderSongList(items);

    expect(screen.getByTestId("title-1")).toBeTruthy();

    const viewport = getViewport(container);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 50);

    expect(screen.queryByTestId("title-1")).toBeNull();
    expect(screen.getByTestId("title-51")).toBeTruthy();
  });

  it("shows the last item when scrolled to the list end", async () => {
    const items = createSongs(120);
    const { container } = renderSongList(items);

    const viewport = getViewport(container);
    await scrollViewport(viewport, items.length * VIRTUAL_SCROLL_ROW_HEIGHT);

    expect(screen.getByTestId(`title-${items.length}`)).toBeTruthy();
  });

  it("does not render empty row shells when scrolled to the list end", async () => {
    const items = createSongs(120);
    const { container } = renderSongList(items);

    const viewport = getViewport(container);
    await scrollViewport(viewport, items.length * VIRTUAL_SCROLL_ROW_HEIGHT);

    const rows = container.querySelectorAll('[data-part="row"]');
    for (const row of rows) {
      expect(row.querySelector("[data-testid^='title-']")).toBeTruthy();
    }
  });

  it("renders no rows for an empty list", () => {
    const { container } = renderSongList([]);

    expect(container.querySelectorAll('[data-part="row"]')).toHaveLength(0);
    expect(getViewport(container).style.getPropertyValue("--uiify-virtual-scroll-count")).toBe("0");
  });

  it("applies testId and className to the scrollport", () => {
    renderSongList(createSongs(5), { className: "team-list", testId: "virtual-scroll-viewport" });

    const viewport = screen.getByTestId("virtual-scroll-viewport");
    expect(viewport.className).toContain("team-list");
    expect(viewport.dataset.uiifyVirtualScroll).toBe("");
  });

  it("respects custom rowHeight and overscan", async () => {
    const observer = stubResizeObserver(400);
    const rowHeight = 40;
    const overscan = 2;
    const items = createSongs(1_000);

    const { container } = renderSongList(items, { rowHeight, overscan, height: 400 });
    await act(async () => {
      observer.trigger(getViewport(container), 400);
    });

    const rows = document.querySelectorAll('[data-part="row"]');
    const visible = Math.ceil(400 / rowHeight);
    expect(rows.length).toBeLessThanOrEqual(visible + overscan * 2);
    expect(getViewport(container).style.getPropertyValue("--uiify-virtual-scroll-row-height")).toBe(
      "40px",
    );

    vi.unstubAllGlobals();
  });

  it("updates item count CSS variable when items shrink", () => {
    const initial = createSongs(100);
    const { container, rerender } = renderSongList(initial);

    expect(getViewport(container).style.getPropertyValue("--uiify-virtual-scroll-count")).toBe(
      "100",
    );

    rerender(
      <VirtualScroll
        height={600}
        items={createSongs(40)}
        renderRow={(song) => <span>{song.title}</span>}
      />,
    );

    expect(getViewport(container).style.getPropertyValue("--uiify-virtual-scroll-count")).toBe(
      "40",
    );
  });

  it("observes viewport resize and disconnects on unmount", () => {
    const observer = stubResizeObserver();

    const items = createSongs(20);
    const { unmount } = renderSongList(items);

    expect(observer.observe.mock.calls.length).toBeGreaterThan(0);

    unmount();
    expect(observer.disconnect.mock.calls.length).toBeGreaterThan(0);

    vi.unstubAllGlobals();
  });

  it("uses ResizeObserver contentRect for viewport height", async () => {
    const observer = stubResizeObserver(320);

    const { container } = renderSongList(createSongs(500), { height: 600 });
    const viewport = getViewport(container);

    await act(async () => {
      observer.trigger(viewport, 320);
    });

    const rows = container.querySelectorAll('[data-part="row"]');
    const visible = Math.ceil(320 / VIRTUAL_SCROLL_ROW_HEIGHT);
    expect(rows.length).toBeLessThanOrEqual(visible + VIRTUAL_SCROLL_OVERSCAN * 2);

    vi.unstubAllGlobals();
  });

  it("recomputes the visible slice when the viewport grows", async () => {
    const observer = stubResizeObserver(200);

    const items = createSongs(200);
    const { container } = renderSongList(items, { height: 200 });
    const viewport = getViewport(container);

    await act(async () => {
      observer.trigger(viewport, 200);
    });

    const rowsBefore = container.querySelectorAll('[data-part="row"]').length;

    await act(async () => {
      observer.trigger(viewport, 600);
    });

    const rowsAfter = container.querySelectorAll('[data-part="row"]').length;
    expect(rowsAfter).toBeGreaterThan(rowsBefore);

    vi.unstubAllGlobals();
  });

  it("renders consistent SSR markup", () => {
    const markup = assertSSRRenderable(
      <VirtualScroll
        height={600}
        items={createSongs(3)}
        renderRow={(song) => <span>{song.title}</span>}
      />,
    );

    expect(markup).toContain('data-uiify-virtual-scroll=""');
    expect(markup).toContain('data-part="spacer"');
    expect(markup).toContain('data-part="row"');
    expect(markup).toContain("Song 1");
  });

  it("exposes list semantics on the scrollport and rows", () => {
    renderSongList(createSongs(20));

    const viewport = screen.getByRole("list");
    expect(viewport.dataset.uiifyVirtualScroll).toBe("");

    const row = viewport.querySelector('[data-part="row"]') as HTMLElement;
    expect(row.getAttribute("role")).toBe("listitem");
    expect(row.getAttribute("aria-setsize")).toBe("20");
    expect(row.getAttribute("aria-posinset")).toBe("1");
  });

  it("fires onRangeChange when the visible slice changes", async () => {
    const onRangeChange = vi.fn();
    const items = createSongs(200);
    const { container } = render(
      <VirtualScroll
        height={600}
        items={items}
        onRangeChange={onRangeChange}
        renderRow={(song) => <span>{song.title}</span>}
      />,
    );

    onRangeChange.mockClear();
    const viewport = getViewport(container);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 11);

    expect(onRangeChange).toHaveBeenCalled();
    const lastCall = onRangeChange.mock.calls.at(-1)?.[0];
    expect(lastCall.overscanStart).toBeGreaterThan(0);
  });

  it("does not fire onRangeChange for sub-row scroll within the same range", async () => {
    const onRangeChange = vi.fn();
    const items = createSongs(200);
    const { container } = render(
      <VirtualScroll
        height={600}
        items={items}
        onRangeChange={onRangeChange}
        renderRow={(song) => <span>{song.title}</span>}
      />,
    );

    onRangeChange.mockClear();
    const viewport = getViewport(container);
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10);
    onRangeChange.mockClear();
    await scrollViewport(viewport, VIRTUAL_SCROLL_ROW_HEIGHT * 10 + 20);

    expect(onRangeChange).not.toHaveBeenCalled();
  });

  it("scrolls imperatively via scrollRef", async () => {
    const handle = {
      current: null as import("./types.js").VirtualScrollHandle | null,
    };
    const items = createSongs(200);
    render(
      <VirtualScroll
        height={600}
        items={items}
        scrollRef={handle}
        renderRow={(song) => <span data-testid={`title-${song.id}`}>{song.title}</span>}
      />,
    );

    await act(async () => {
      handle.current?.scrollToIndex(50, { align: "start", behavior: "instant" });
      await flushScrollSync();
    });

    expect(screen.getByTestId("title-51")).toBeTruthy();
  });

  it("reports scroll settled state", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout"] });
    const onScrollStateChange = vi.fn();
    const items = createSongs(100);
    const { container } = render(
      <VirtualScroll
        height={600}
        items={items}
        isScrollingResetDelay={100}
        onScrollStateChange={onScrollStateChange}
        renderRow={(song) => <span>{song.title}</span>}
      />,
    );

    const viewport = getViewport(container);
    await act(async () => {
      await flushScrollSync();
      viewport.scrollTop = VIRTUAL_SCROLL_ROW_HEIGHT * 5;
      fireEvent.scroll(viewport);
      await flushScrollSync();
      if (supportsScrollEndEvent()) {
        viewport.dispatchEvent(new Event("scrollend"));
      } else {
        vi.advanceTimersByTime(100);
      }
    });

    expect(onScrollStateChange).toHaveBeenCalledWith({ isScrolling: true });
    expect(onScrollStateChange).toHaveBeenCalledWith({ isScrolling: false });
    vi.useRealTimers();
  });

  it("supports variable row heights via estimateRowHeight", async () => {
    const observer = stubResizeObserver(600);
    const items = createSongs(50);
    const { container } = render(
      <VirtualScroll
        height={600}
        items={items}
        estimateRowHeight={(index) => (index % 2 === 0 ? 80 : 40)}
        renderRow={(song) => <span data-testid={`title-${song.id}`}>{song.title}</span>}
      />,
    );

    const viewport = getViewport(container);
    expect(viewport.dataset.dynamicLayout).toBe("");

    await act(async () => {
      observer.trigger(viewport, 600);
      await scrollViewport(viewport, 400);
    });

    const row = container.querySelector('[data-part="row"]') as HTMLElement;
    expect(row.style.getPropertyValue("--uiify-row-offset")).not.toBe("");

    vi.unstubAllGlobals();
  });

  it("measures every pooled row with one ResizeObserver, not one per row", () => {
    let constructed = 0;
    const observed: Element[] = [];

    class CountingResizeObserver {
      constructor() {
        constructed += 1;
      }
      observe(element: Element): void {
        observed.push(element);
      }
      unobserve(): void {}
      disconnect(): void {}
    }
    vi.stubGlobal("ResizeObserver", CountingResizeObserver);

    const items = createSongs(500);
    const { container } = render(
      <VirtualScroll
        height={600}
        items={items}
        estimateRowHeight={() => 64}
        renderRow={(song) => <span data-testid={`title-${song.id}`}>{song.title}</span>}
      />,
    );

    const rows = container.querySelectorAll('[data-part="row"]');
    expect(rows.length).toBeGreaterThan(1);

    // One observer for the scrollport viewport, one for the whole row Fragment.
    // Before Fragment Refs this was 2 + rows.length.
    expect(constructed).toBe(1);
    expect(observed.length).toBe(1);

    vi.unstubAllGlobals();
  });
});

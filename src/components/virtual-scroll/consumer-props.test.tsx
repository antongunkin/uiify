import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { createRef, type CSSProperties } from "react";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import * as iosModule from "./virtual-scroll-ios.js";
import * as scrollStateModule from "./virtual-scroll-scroll-state.js";
import { VirtualScroll } from "./VirtualScroll.js";
import type { VirtualScrollHandle, VirtualScrollOwnProps } from "./types.js";

const items = Array.from({ length: 30 }, (_, index) => ({
  id: String(index),
  title: `Row ${index}`,
}));
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}

it("preserves default virtual scroll DOM", () => {
  expect({
    fixed: outline(
      renderToStaticMarkup(
        <VirtualScroll items={items.slice(0, 2)} renderRow={(item) => item.title} />,
      ),
    ),
    dynamicGrid: outline(
      renderToStaticMarkup(
        <VirtualScroll
          items={items.slice(0, 2)}
          role="grid"
          orientation="horizontal"
          estimateRowHeight={() => 40}
          renderRow={(item) => item.title}
        />,
      ),
    ),
  }).toMatchSnapshot();
});

it("lets native props and row routes replace virtual scroll defaults", () => {
  const { container } = render(
    <VirtualScroll
      items={items.slice(0, 2)}
      renderRow={(item) => item.title}
      testId="fallback"
      data-testid={undefined}
      role="note"
      data-uiify-virtual-scroll="custom"
      data-orientation={undefined}
      style={{ overflowY: "visible", "--uiify-virtual-scroll-count": 7 } as CSSProperties}
      slotProps={{
        spacer: {
          "data-part": "custom-spacer",
          "data-testid": "spacer",
          style: { "--uiify-range-start": 7 } as CSSProperties,
        },
        row: {
          "data-part": "common",
          role: "note",
          "aria-setsize": 7,
          byItemValue: { "1": { "data-part": "stable" } },
          byItemIndex: {
            1: {
              "data-part": "indexed",
              "data-testid": "row",
              "aria-posinset": undefined,
              style: { "--uiify-slot-index": 7 } as CSSProperties,
            },
          },
        },
      }}
    />,
  );
  const root = container.firstElementChild as HTMLElement;
  expect(root.getAttribute("role")).toBe("note");
  expect(root.hasAttribute("data-testid")).toBe(false);
  expect(root.getAttribute("data-uiify-virtual-scroll")).toBe("custom");
  expect(root.hasAttribute("data-orientation")).toBe(false);
  expect(root.style.overflowY).toBe("visible");
  expect(root.style.getPropertyValue("--uiify-virtual-scroll-count")).toBe("7");
  expect(screen.getByTestId("spacer").getAttribute("data-part")).toBe("custom-spacer");
  expect(screen.getByTestId("spacer").style.getPropertyValue("--uiify-range-start")).toBe("7");
  const row = screen.getByTestId("row");
  expect(row.getAttribute("data-part")).toBe("indexed");
  expect(row.getAttribute("role")).toBe("note");
  expect(row.getAttribute("aria-setsize")).toBe("7");
  expect(row.hasAttribute("aria-posinset")).toBe(false);
  expect(row.style.getPropertyValue("--uiify-slot-index")).toBe("7");
});

it("removes an explicit undefined root role while retaining list rows", () => {
  const props: VirtualScrollOwnProps<(typeof items)[number]> = {
    items: items.slice(0, 1),
    role: undefined,
    renderRow: (item) => item.title,
  };
  const { container } = render(<VirtualScroll {...props} />);
  expect(container.firstElementChild?.hasAttribute("role")).toBe(false);
  expect(screen.getByRole("listitem")).toBeTruthy();
});

it("lets the consumer veto scroll synchronization and still synchronizes when allowed", () => {
  const onRangeChange = vi.fn();
  const onScrollStateChange = vi.fn();
  const consumer = vi.fn((event: React.UIEvent<HTMLDivElement>) => event.preventDefault());
  const props: VirtualScrollOwnProps<(typeof items)[number]> = {
    items,
    height: 64,
    overscan: 0,
    renderRow: (item) => item.title,
    onRangeChange,
    onScrollStateChange,
  };
  const { container, rerender } = render(<VirtualScroll {...props} onScroll={consumer} />);
  const root = container.firstElementChild as HTMLDivElement;
  onRangeChange.mockClear();
  root.scrollTop = 640;
  fireEvent(root, createEvent.scroll(root, { cancelable: true }));
  expect(consumer).toHaveBeenCalledOnce();
  expect(onRangeChange).not.toHaveBeenCalled();
  expect(onScrollStateChange).not.toHaveBeenCalled();
  expect(screen.getByText("Row 0")).toBeTruthy();
  rerender(<VirtualScroll {...props} />);
  fireEvent.scroll(root);
  expect(screen.getByText("Row 10")).toBeTruthy();
  expect(onRangeChange).toHaveBeenCalled();
  expect(onScrollStateChange).toHaveBeenCalledWith({ isScrolling: true });
});

it("composes scrollend callbacks and retains scroll-state cleanup", () => {
  const onScrollStateChange = vi.fn();
  const onScrollEnd = vi.fn((event: React.UIEvent<HTMLDivElement>) => event.preventDefault());
  const props = {
    items,
    height: 64,
    renderRow: (item: (typeof items)[number]) => item.title,
    onScrollStateChange,
  };
  const { container, rerender, unmount } = render(
    <VirtualScroll {...props} onScrollEnd={onScrollEnd} />,
  );
  const root = container.firstElementChild as HTMLDivElement;
  fireEvent.scroll(root);
  onScrollStateChange.mockClear();
  fireEvent(root, new Event("scrollend", { cancelable: true }));
  expect(onScrollEnd).toHaveBeenCalledOnce();
  expect(onScrollStateChange).not.toHaveBeenCalled();
  rerender(<VirtualScroll {...props} />);
  fireEvent(root, new Event("scrollend"));
  expect(onScrollStateChange).toHaveBeenCalledWith({ isScrolling: false });
  unmount();
});

it("merges root and common/stable/index row refs with cleanup", () => {
  const rootRef = createRef<HTMLDivElement>();
  const scrollRef = createRef<VirtualScrollHandle>();
  const cleanups = [vi.fn(), vi.fn(), vi.fn()];
  const refs = cleanups.map((cleanup) => vi.fn(() => cleanup));
  const { unmount } = render(
    <VirtualScroll
      ref={rootRef}
      scrollRef={scrollRef}
      items={items.slice(0, 1)}
      renderRow={(item) => item.title}
      slotProps={{
        row: {
          ref: refs[0],
          byItemValue: { "0": { ref: refs[1] } },
          byItemIndex: { 0: { ref: refs[2] } },
        },
      }}
    />,
  );
  const row = screen.getByRole("listitem");
  for (const ref of refs) expect(ref).toHaveBeenCalledWith(row);
  expect(scrollRef.current?.element).toBe(rootRef.current);
  unmount();
  for (const cleanup of cleanups) expect(cleanup).toHaveBeenCalled();
  expect(rootRef.current).toBeNull();
  expect(scrollRef.current).toBeNull();
});

it("runs touch consumers before internal callbacks and honors both vetoes", () => {
  const onTouchStart = vi.fn();
  const onTouchEnd = vi.fn();
  const controller = {
    onTouchStart,
    onTouchEnd,
    isTouchScrolling: () => false,
    queueAdjustment: vi.fn(),
    flushAdjustments: vi.fn(),
    dispose: vi.fn(),
  };
  const createController = vi
    .spyOn(iosModule, "createVirtualScrollIosScroll")
    .mockReturnValue(controller);
  const veto = vi.fn((event: React.TouchEvent<HTMLDivElement>) => event.preventDefault());
  const { container, rerender, unmount } = render(
    <VirtualScroll
      items={items}
      renderRow={(item) => item.title}
      onTouchStart={veto}
      onTouchEnd={veto}
    />,
  );
  const root = container.firstElementChild as HTMLDivElement;
  fireEvent.touchStart(root, { cancelable: true });
  fireEvent.touchEnd(root, { cancelable: true });
  expect(veto).toHaveBeenCalledTimes(2);
  expect(onTouchStart).not.toHaveBeenCalled();
  expect(onTouchEnd).not.toHaveBeenCalled();
  rerender(<VirtualScroll items={items} renderRow={(item) => item.title} />);
  fireEvent.touchStart(root);
  fireEvent.touchEnd(root);
  expect(onTouchStart).toHaveBeenCalledOnce();
  expect(onTouchEnd).toHaveBeenCalledOnce();
  unmount();
  createController.mockRestore();
});

it("disposes the fallback scroll-state timer on unmount", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const supportsScrollEnd = vi
    .spyOn(scrollStateModule, "supportsScrollEndEvent")
    .mockReturnValue(false);
  const onScrollStateChange = vi.fn();
  const { container, unmount } = render(
    <VirtualScroll
      items={items}
      renderRow={(item) => item.title}
      onScrollStateChange={onScrollStateChange}
    />,
  );
  fireEvent.scroll(container.firstElementChild as HTMLDivElement);
  expect(onScrollStateChange).toHaveBeenCalledWith({ isScrolling: true });
  unmount();
  vi.advanceTimersByTime(1000);
  expect(onScrollStateChange).toHaveBeenCalledTimes(1);
  supportsScrollEnd.mockRestore();
  vi.useRealTimers();
});

it("keeps consumer spacer geometry after scroll, including undefined removal", () => {
  const props = {
    items,
    height: 64,
    overscan: 0,
    renderRow: (item: (typeof items)[number]) => item.title,
  };
  const { container, rerender } = render(
    <VirtualScroll
      {...props}
      slotProps={{ spacer: { style: { "--uiify-range-start": "7" } as CSSProperties } }}
    />,
  );
  const root = container.firstElementChild as HTMLDivElement;
  const spacer = root.firstElementChild as HTMLDivElement;
  root.scrollTop = 640;
  fireEvent.scroll(root);
  expect(spacer.style.getPropertyValue("--uiify-range-start")).toBe("7");
  rerender(
    <VirtualScroll
      {...props}
      slotProps={{ spacer: { style: { "--uiify-range-start": undefined } as CSSProperties } }}
    />,
  );
  root.scrollTop = 1280;
  fireEvent.scroll(root);
  expect(spacer.style.getPropertyValue("--uiify-range-start")).toBe("");
});

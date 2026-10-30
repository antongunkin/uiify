import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, type CSSProperties } from "react";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { CandleChart } from "./CandleChart.js";
import { CandleChartClient } from "./client/CandleChartClient.js";

const data = [
  { time: "2026-09-01", open: 10, high: 20, low: 5, close: 15 },
  { time: "2026-10-01", open: 15, high: 25, low: 10, close: 20 },
];
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
it("preserves default candle chart DOM", () => {
  expect({
    base: outline(renderToStaticMarkup(<CandleChart data={data} />)),
    interactive: outline(
      renderToStaticMarkup(<CandleChart data={data} interactive activeCandleIndex={0} />),
    ),
    client: outline(renderToStaticMarkup(<CandleChartClient data={data} />)),
    live: outline(renderToStaticMarkup(<CandleChartClient data={data} visibleCount={1} />)),
  }).toMatchSnapshot();
});

it("forwards native chart defaults, explicit undefined and indexed geometry overrides", () => {
  render(
    <CandleChart
      data={data}
      interactive
      activeCandleIndex={0}
      aria-label={undefined}
      data-uiify-candle-chart="custom"
      data-testid="chart"
      slotProps={{
        plot: { "data-part": "custom-plot", "aria-hidden": false, "data-testid": "plot" },
        candles: {
          "aria-label": undefined,
          style: { "--candle-count": "7" } as CSSProperties,
          "data-testid": "candles",
        },
        readout: { "aria-live": "assertive", "data-testid": "readout" },
        candle: {
          "data-part": "custom-candle",
          byItemIndex: {
            0: {
              "data-time": "custom",
              "data-direction": "custom",
              "aria-hidden": true,
              style: { "--candle-x": "7%" } as CSSProperties,
              "data-testid": "candle",
            },
          },
        },
        candleHit: {
          byItemIndex: {
            0: {
              type: "submit",
              "aria-label": undefined,
              "aria-pressed": undefined,
              "data-part": "custom-hit",
              "data-testid": "hit",
            },
          },
        },
        crosshair: {
          "aria-hidden": false,
          style: { "--candle-crosshair-x": "7%" } as CSSProperties,
          "data-testid": "crosshair",
        },
        timeAxis: { "data-axis": "custom-time", "aria-label": undefined, "data-testid": "time" },
        priceAxis: { "data-axis": "custom-value", "data-testid": "value" },
        timeAxisLabel: {
          byItemIndex: {
            0: { style: { "--candle-axis-x": "7%" } as CSSProperties, "data-testid": "tick" },
          },
        },
        crosshairTime: {
          style: { "--candle-crosshair-x": "7%" } as CSSProperties,
          "data-testid": "crosshair-time",
        },
        crosshairPrice: {
          style: { "--candle-cursor-y": "7px" } as CSSProperties,
          "data-testid": "crosshair-value",
        },
        dataTable: { "aria-label": undefined, "data-part": "custom-table", "data-testid": "table" },
        dataTableTimeHeader: { scope: "row", "data-testid": "header" },
        dataTableTimeCell: { byItemIndex: { 0: { scope: undefined, "data-testid": "cell" } } },
      }}
    />,
  );
  expect(screen.getByTestId("chart").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("chart").getAttribute("data-uiify-candle-chart")).toBe("custom");
  expect(screen.getByTestId("plot").getAttribute("data-part")).toBe("custom-plot");
  expect(screen.getByTestId("plot").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByTestId("candles").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("candles").style.getPropertyValue("--candle-count")).toBe("7");
  expect(screen.getByTestId("readout").getAttribute("aria-live")).toBe("assertive");
  expect(screen.getByTestId("candle").getAttribute("data-time")).toBe("custom");
  expect(screen.getByTestId("candle").getAttribute("data-direction")).toBe("custom");
  expect(screen.getByTestId("candle").style.getPropertyValue("--candle-x")).toBe("7%");
  expect(screen.getByTestId("hit").getAttribute("type")).toBe("submit");
  expect(screen.getByTestId("hit").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("hit").hasAttribute("aria-pressed")).toBe(false);
  expect(screen.getByTestId("hit").getAttribute("data-part")).toBe("custom-hit");
  expect(screen.getByTestId("crosshair").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByTestId("crosshair").style.getPropertyValue("--candle-crosshair-x")).toBe("7%");
  expect(screen.getByTestId("time").getAttribute("data-axis")).toBe("custom-time");
  expect(screen.getByTestId("time").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("value").getAttribute("data-axis")).toBe("custom-value");
  expect(screen.getByTestId("tick").style.getPropertyValue("--candle-axis-x")).toBe("7%");
  expect(screen.getByTestId("crosshair-time").style.getPropertyValue("--candle-crosshair-x")).toBe(
    "7%",
  );
  expect(screen.getByTestId("crosshair-value").style.getPropertyValue("--candle-cursor-y")).toBe(
    "7px",
  );
  expect(screen.getByTestId("table").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("header").getAttribute("scope")).toBe("row");
  expect(screen.getByTestId("cell").hasAttribute("scope")).toBe(false);
});

it("runs both consumer hit handlers and vetoes click, keyboard and pointer actions", () => {
  const onCandleClick = vi.fn();
  const onCandlePointerMove = vi.fn();
  const onCandlePointerLeave = vi.fn();
  const common = vi.fn();
  const indexed = vi.fn();
  render(
    <CandleChart
      data={data.slice(0, 1)}
      interactive
      onCandleClick={onCandleClick}
      onCandlePointerMove={onCandlePointerMove}
      onCandlePointerLeave={onCandlePointerLeave}
      slotProps={{
        candleHit: {
          onClick: (event) => {
            common();
            event.preventDefault();
          },
          onKeyDown: (event) => event.preventDefault(),
          onPointerMove: (event) => event.preventDefault(),
          onPointerLeave: (event) => event.preventDefault(),
          byItemIndex: { 0: { onClick: indexed } },
        },
      }}
    />,
  );
  const hit = screen.getByRole("button");
  fireEvent.click(hit);
  fireEvent.keyDown(hit, { key: "Enter" });
  fireEvent.pointerMove(hit);
  fireEvent.pointerLeave(hit);
  expect(common).toHaveBeenCalledOnce();
  expect(indexed).toHaveBeenCalledOnce();
  expect(onCandleClick).not.toHaveBeenCalled();
  expect(onCandlePointerMove).not.toHaveBeenCalled();
  expect(onCandlePointerLeave).not.toHaveBeenCalled();
});

it("merges candle ref cleanup and client root refs while preserving live native props", () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(target: Element): void {
        this.callback(
          [
            {
              target,
              contentRect: new DOMRectReadOnly(0, 0, 684, 312),
              borderBoxSize: [{ inlineSize: 684, blockSize: 312 }],
              contentBoxSize: [{ inlineSize: 684, blockSize: 312 }],
              devicePixelContentBoxSize: [],
            },
          ],
          this,
        );
      }
      unobserve(): void {}
      disconnect(): void {}
    },
  );
  const rootRef = createRef<HTMLElement>();
  const commonCleanup = vi.fn();
  const indexedCleanup = vi.fn();
  const commonRef = vi.fn(() => commonCleanup);
  const indexedRef = vi.fn(() => indexedCleanup);
  const { unmount } = render(
    <CandleChartClient
      data={data.slice(0, 1)}
      visibleCount={1}
      ref={rootRef}
      style={
        {
          "--candle-scale": "7",
          "--candle-content-size": "7px",
          "--candle-plot-height": "7px",
        } as CSSProperties
      }
      slotProps={{
        liveScrollport: {
          role: "note",
          "data-part": "live-custom",
          "data-uiify-virtual-scroll": "custom",
          "data-testid": "scrollport",
        },
        liveCandleRow: {
          role: "note",
          byItemIndex: { 0: { "aria-posinset": undefined, "data-testid": "row" } },
        },
        candle: {
          ref: commonRef,
          byItemIndex: { 0: { ref: indexedRef, "data-testid": "candle" } },
        },
      }}
    />,
  );
  expect(rootRef.current?.style.getPropertyValue("--candle-scale")).toBe("7");
  expect(rootRef.current?.style.getPropertyValue("--candle-content-size")).toBe("7px");
  expect(rootRef.current?.style.getPropertyValue("--candle-plot-height")).toBe("7px");
  expect(screen.getByTestId("scrollport").getAttribute("role")).toBe("note");
  expect(screen.getByTestId("scrollport").getAttribute("data-uiify-virtual-scroll")).toBe("custom");
  expect(screen.getByTestId("row").hasAttribute("aria-posinset")).toBe(false);
  expect(commonRef).toHaveBeenCalledWith(screen.getByTestId("candle"));
  expect(indexedRef).toHaveBeenCalledWith(screen.getByTestId("candle"));
  expect(screen.getByTestId("candle").tagName).toBe("DIV");
  unmount();
  expect(commonCleanup).toHaveBeenCalled();
  expect(indexedCleanup).toHaveBeenCalled();
  expect(rootRef.current).toBeNull();
  vi.unstubAllGlobals();
});

it("keeps consumer live scroll styles on mount and scroll, including undefined removal", () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(target: Element): void {
        this.callback(
          [
            {
              target,
              contentRect: new DOMRectReadOnly(0, 0, 684, 312),
              borderBoxSize: [{ inlineSize: 684, blockSize: 327 }],
              contentBoxSize: [{ inlineSize: 684, blockSize: 312 }],
              devicePixelContentBoxSize: [],
            },
          ],
          this,
        );
      }
      unobserve(): void {}
      disconnect(): void {}
    },
  );
  const liveData = Array.from({ length: 30 }, (_, index) => ({ ...data[0]!, time: index }));
  const rootRef = createRef<HTMLElement>();
  const scrollportRef = createRef<HTMLDivElement>();
  const { rerender, unmount } = render(
    <CandleChartClient
      data={liveData}
      visibleCount={10}
      ref={rootRef}
      style={{ "--candle-scroll-x": "7px" } as CSSProperties}
      slotProps={{ liveScrollport: { ref: scrollportRef } }}
    />,
  );
  expect(rootRef.current?.style.getPropertyValue("--candle-scroll-x")).toBe("7px");
  const element = scrollportRef.current!;
  element.scrollLeft = 60;
  fireEvent.scroll(element);
  expect(rootRef.current?.style.getPropertyValue("--candle-scroll-x")).toBe("7px");
  rerender(
    <CandleChartClient
      data={liveData}
      visibleCount={10}
      ref={rootRef}
      style={{ "--candle-scroll-x": undefined } as CSSProperties}
      slotProps={{ liveScrollport: { ref: scrollportRef } }}
    />,
  );
  element.scrollLeft = 120;
  fireEvent.scroll(element);
  expect(rootRef.current?.style.getPropertyValue("--candle-scroll-x")).toBe("");
  unmount();
  vi.unstubAllGlobals();
});

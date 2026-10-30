import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, type CSSProperties } from "react";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { LineChart } from "./LineChart.js";
import { LineChartClient } from "./client/LineChartClient.js";

const data = [
  { time: "2026-09-01", value: 10 },
  { time: "2026-10-01", value: 20 },
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
it("preserves default line chart DOM", () => {
  expect({
    base: outline(renderToStaticMarkup(<LineChart data={data} />)),
    interactive: outline(
      renderToStaticMarkup(<LineChart data={data} interactive activePointIndex={0} />),
    ),
    client: outline(renderToStaticMarkup(<LineChartClient data={data} />)),
    live: outline(renderToStaticMarkup(<LineChartClient data={data} visibleCount={1} />)),
  }).toMatchSnapshot();
});

it("forwards native chart defaults, explicit undefined and indexed geometry overrides", () => {
  render(
    <LineChart
      data={data}
      interactive
      activePointIndex={0}
      aria-label={undefined}
      data-uiify-line-chart="custom"
      data-testid="chart"
      slotProps={{
        plot: { "data-part": "custom-plot", "aria-hidden": false, "data-testid": "plot" },
        points: {
          "aria-label": undefined,
          style: { "--line-count": "7" } as CSSProperties,
          "data-testid": "points",
        },
        readout: { "aria-live": "assertive", "data-testid": "readout" },
        point: {
          "data-part": "custom-point",
          byItemIndex: {
            0: {
              "data-time": "custom",
              "data-trend": "custom",
              "aria-hidden": true,
              style: { "--line-x": "7%" } as CSSProperties,
              "data-testid": "point",
            },
          },
        },
        pointHit: {
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
          style: { "--line-crosshair-x": "7%" } as CSSProperties,
          "data-testid": "crosshair",
        },
        timeAxis: { "data-axis": "custom-time", "aria-label": undefined, "data-testid": "time" },
        valueAxis: { "data-axis": "custom-value", "data-testid": "value" },
        timeAxisLabel: {
          byItemIndex: {
            0: { style: { "--line-axis-x": "7%" } as CSSProperties, "data-testid": "tick" },
          },
        },
        crosshairTime: {
          style: { "--line-crosshair-x": "7%" } as CSSProperties,
          "data-testid": "crosshair-time",
        },
        crosshairValue: {
          style: { "--line-cursor-y": "7px" } as CSSProperties,
          "data-testid": "crosshair-value",
        },
        dataTable: { "aria-label": undefined, "data-part": "custom-table", "data-testid": "table" },
        dataTableTimeHeader: { scope: "row", "data-testid": "header" },
        dataTableTimeCell: { byItemIndex: { 0: { scope: undefined, "data-testid": "cell" } } },
      }}
    />,
  );
  expect(screen.getByTestId("chart").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("chart").getAttribute("data-uiify-line-chart")).toBe("custom");
  expect(screen.getByTestId("plot").getAttribute("data-part")).toBe("custom-plot");
  expect(screen.getByTestId("plot").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByTestId("points").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("points").style.getPropertyValue("--line-count")).toBe("7");
  expect(screen.getByTestId("readout").getAttribute("aria-live")).toBe("assertive");
  expect(screen.getByTestId("point").getAttribute("data-time")).toBe("custom");
  expect(screen.getByTestId("point").getAttribute("data-trend")).toBe("custom");
  expect(screen.getByTestId("point").style.getPropertyValue("--line-x")).toBe("7%");
  expect(screen.getByTestId("hit").getAttribute("type")).toBe("submit");
  expect(screen.getByTestId("hit").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("hit").hasAttribute("aria-pressed")).toBe(false);
  expect(screen.getByTestId("hit").getAttribute("data-part")).toBe("custom-hit");
  expect(screen.getByTestId("crosshair").getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByTestId("crosshair").style.getPropertyValue("--line-crosshair-x")).toBe("7%");
  expect(screen.getByTestId("time").getAttribute("data-axis")).toBe("custom-time");
  expect(screen.getByTestId("time").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("value").getAttribute("data-axis")).toBe("custom-value");
  expect(screen.getByTestId("tick").style.getPropertyValue("--line-axis-x")).toBe("7%");
  expect(screen.getByTestId("crosshair-time").style.getPropertyValue("--line-crosshair-x")).toBe(
    "7%",
  );
  expect(screen.getByTestId("crosshair-value").style.getPropertyValue("--line-cursor-y")).toBe(
    "7px",
  );
  expect(screen.getByTestId("table").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("header").getAttribute("scope")).toBe("row");
  expect(screen.getByTestId("cell").hasAttribute("scope")).toBe(false);
});

it("runs both consumer hit handlers and vetoes click, keyboard and pointer actions", () => {
  const onPointClick = vi.fn();
  const onPointPointerMove = vi.fn();
  const onPointPointerLeave = vi.fn();
  const common = vi.fn();
  const indexed = vi.fn();
  render(
    <LineChart
      data={data.slice(0, 1)}
      interactive
      onPointClick={onPointClick}
      onPointPointerMove={onPointPointerMove}
      onPointPointerLeave={onPointPointerLeave}
      slotProps={{
        pointHit: {
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
  expect(onPointClick).not.toHaveBeenCalled();
  expect(onPointPointerMove).not.toHaveBeenCalled();
  expect(onPointPointerLeave).not.toHaveBeenCalled();
});

it("merges point ref cleanup and client root refs while preserving live native props", () => {
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
    <LineChartClient
      data={data.slice(0, 1)}
      visibleCount={1}
      ref={rootRef}
      style={
        {
          "--line-scale": "7",
          "--line-content-size": "7px",
          "--line-plot-height": "7px",
          "--line-run": "7",
        } as CSSProperties
      }
      slotProps={{
        liveScrollport: {
          role: "note",
          "data-part": "live-custom",
          "data-uiify-virtual-scroll": "custom",
          "data-testid": "scrollport",
        },
        livePointRow: {
          role: "note",
          byItemIndex: { 0: { "aria-posinset": undefined, "data-testid": "row" } },
        },
        point: { ref: commonRef, byItemIndex: { 0: { ref: indexedRef, "data-testid": "point" } } },
      }}
    />,
  );
  expect(rootRef.current?.style.getPropertyValue("--line-scale")).toBe("7");
  expect(rootRef.current?.style.getPropertyValue("--line-content-size")).toBe("7px");
  expect(rootRef.current?.style.getPropertyValue("--line-plot-height")).toBe("7px");
  expect(rootRef.current?.style.getPropertyValue("--line-run")).toBe("7");
  expect(screen.getByTestId("scrollport").getAttribute("role")).toBe("note");
  expect(screen.getByTestId("scrollport").getAttribute("data-uiify-virtual-scroll")).toBe("custom");
  expect(screen.getByTestId("row").hasAttribute("aria-posinset")).toBe(false);
  expect(commonRef).toHaveBeenCalledWith(screen.getByTestId("point"));
  expect(indexedRef).toHaveBeenCalledWith(screen.getByTestId("point"));
  expect(screen.getByTestId("point").tagName).toBe("DIV");
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
    <LineChartClient
      data={liveData}
      visibleCount={10}
      ref={rootRef}
      style={{ "--line-scroll-x": "7px" } as CSSProperties}
      slotProps={{ liveScrollport: { ref: scrollportRef } }}
    />,
  );
  expect(rootRef.current?.style.getPropertyValue("--line-scroll-x")).toBe("7px");
  const element = scrollportRef.current!;
  element.scrollLeft = 60;
  fireEvent.scroll(element);
  expect(rootRef.current?.style.getPropertyValue("--line-scroll-x")).toBe("7px");
  rerender(
    <LineChartClient
      data={liveData}
      visibleCount={10}
      ref={rootRef}
      style={{ "--line-scroll-x": undefined } as CSSProperties}
      slotProps={{ liveScrollport: { ref: scrollportRef } }}
    />,
  );
  element.scrollLeft = 120;
  fireEvent.scroll(element);
  expect(rootRef.current?.style.getPropertyValue("--line-scroll-x")).toBe("");
  unmount();
  vi.unstubAllGlobals();
});

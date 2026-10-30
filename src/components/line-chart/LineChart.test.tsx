import { fireEvent, render } from "@testing-library/react";
import { createRef, type MouseEvent, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { LineChart } from "./LineChart.js";
import type { LineChartData } from "./types.js";

const DATA: readonly LineChartData[] = [
  { time: "2026-09-01", value: 100 },
  { time: "2026-09-02", value: 120 },
  { time: "2026-10-01", value: 110 },
];

describe("LineChart", () => {
  it("renders a CSS-only line with responsive point and segment geometry", () => {
    const { container } = render(<LineChart data={DATA} data-testid="chart" />);
    const chart = container.querySelector("[data-testid='chart']") as HTMLElement;
    const points = [...chart.querySelectorAll('[data-part="points"] > li')];

    expect(chart.tagName).toBe("FIGURE");
    expect(chart.getAttribute("data-uiify-line-chart")).toBe("");
    expect(points).toHaveLength(3);
    expect(points[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(points[0]?.getAttribute("style")).toContain("--line-y:");
    expect(points[0]?.getAttribute("style")).toContain("--line-slot: 50%");
    expect(points[0]?.getAttribute("style")).toContain("--line-x: 0%");
    expect(points[0]?.getAttribute("style")).not.toContain("--line-prev-y");
    expect(points[1]?.getAttribute("style")).toContain("--line-prev-y:");
    expect(points[0]?.getAttribute("style")).not.toContain("--line-rise");
    expect(points[1]?.getAttribute("style")).toMatch(/--line-rise: -?\d/);
    expect(points[1]?.getAttribute("style")).toContain("--line-prev-x: 0%");
    expect(points[1]?.getAttribute("data-time")).toBe("2026-09-02");
    expect(chart.querySelectorAll('[data-part="points"] button')).toHaveLength(0);
  });

  it("renders a table fallback with the original values", () => {
    const { container } = render(<LineChart data={DATA} aria-label="Daily prices" />);
    const table = container.querySelector("table");

    expect(table?.getAttribute("aria-label")).toBe("Daily prices data");
    expect(table?.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(table?.textContent).toContain("2026-09-01");
    expect(table?.textContent).toContain("120");
  });

  it("keeps a flat range renderable", () => {
    const { container } = render(<LineChart data={[{ time: 1, value: 10 }]} />);

    expect(container.querySelector('[data-part="points"] > li')?.getAttribute("style")).toContain(
      "--line-y: 50%",
    );
  });

  it("renders date and value axes and accepts consumer overrides", () => {
    const { container } = render(
      <LineChart
        data={DATA}
        xAxis={[{ label: "Launch", position: -12.5 }]}
        yAxis={[{ label: "$100.25", position: 137.5 }]}
      />,
    );

    expect(container.querySelector("[data-axis='time']")?.textContent).toBe("Launch");
    expect(container.querySelector("[data-axis='time'] li")?.getAttribute("style")).toContain(
      "--line-axis-x: 0%",
    );
    expect(container.querySelector("[data-axis='value']")?.textContent).toBe("$100.25");
    expect(container.querySelector("[data-axis='value'] li")?.getAttribute("style")).toContain(
      "--line-axis-y: 100%",
    );
  });

  it("renders an interactive readout and dispatches point clicks", () => {
    const onPointClick = vi.fn();
    const { container } = render(
      <LineChart
        data={DATA}
        interactive
        activePointIndex={2}
        selectedPointIndex={2}
        cursorY={42}
        onPointClick={onPointClick}
      />,
    );
    const points = container.querySelectorAll('[data-part="points"] > li');
    const active = points[2];
    const hit = active?.querySelector("button") as HTMLButtonElement;

    expect(container.querySelector('[data-part="plot"]')?.getAttribute("aria-hidden")).toBeNull();
    expect(active?.getAttribute("data-crosshair-active")).toBe("");
    expect(hit.getAttribute("aria-label")).toBe("Point 2026-10-01");
    expect(hit.getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector('[data-part="readout"]')?.textContent).toContain("110");
    expect(container.querySelector('[data-part="crosshair"]')).not.toBeNull();
    expect(container.querySelector('[data-part="crosshair"]')?.getAttribute("style")).toContain(
      "--line-crosshair-x: 100%",
    );

    fireEvent.click(hit);
    expect(onPointClick).toHaveBeenCalledWith(2);
  });

  it("forwards slot props to generated chart parts and repeated data nodes", () => {
    const onPointHitClick = vi.fn();
    const onPointHitClickAtIndex = vi.fn();
    const pointRef = createRef<HTMLElement>();
    const { container } = render(
      <LineChart
        data={DATA}
        interactive
        slotProps={{
          caption: { className: "caption", "data-testid": "caption" },
          plot: { className: "plot-custom" },
          point: {
            className: "all-points",
            ref: pointRef,
            byItemIndex: {
              1: { className: "middle-point", "data-testid": "middle-point" },
            },
          },
          pointHit: {
            onClick: onPointHitClick,
            "data-testid": "point-hit",
            byItemIndex: { 1: { onClick: onPointHitClickAtIndex } },
          },
          timeAxisLabel: {
            className: "axis-label",
            byItemIndex: { 0: { "data-testid": "first-time-label" } },
          },
          dataTableRow: {
            byItemIndex: { 1: { className: "selected-row", "data-testid": "row" } },
          },
          dataTableValueCell: { className: "value-cell" },
        }}
      />,
    );

    expect(container.querySelector("figcaption")?.className).toContain("caption");
    expect(container.querySelector('[data-part="plot"]')?.className).toContain("plot-custom");
    expect(container.querySelectorAll('[data-part="point"]')[0]?.className).toContain("all-points");
    expect(container.querySelector('[data-testid="middle-point"]')?.className).toContain(
      "middle-point",
    );
    expect(container.querySelector('[data-testid="first-time-label"]')?.className).toContain(
      "axis-label",
    );
    expect(container.querySelector('[data-testid="row"]')?.className).toContain("selected-row");
    expect(container.querySelector("tbody td")?.className).toContain("value-cell");
    expect(pointRef.current?.tagName).toBe("LI");

    fireEvent.click(container.querySelector('[data-testid="point-hit"]') as HTMLButtonElement);
    expect(onPointHitClick).toHaveBeenCalledOnce();
    const indexedHit = container.querySelectorAll('[data-part="point-hit"]')[1];
    fireEvent.click(indexedHit as HTMLButtonElement);
    expect(onPointHitClickAtIndex).toHaveBeenCalledOnce();
  });

  it("lets consumers replace generated anatomy and state defaults", () => {
    const { container } = render(
      <LineChart
        data={DATA}
        slotProps={{ plot: { "data-part": "consumer-plot" }, point: { "data-trend": "custom" } }}
      />,
    );
    expect(container.querySelector('[data-part="consumer-plot"]')).not.toBeNull();
    expect(container.querySelector('[data-part="point"]')?.getAttribute("data-trend")).toBe(
      "custom",
    );
  });

  it("allows a point-hit native click handler to cancel chart activation", () => {
    const onPointClick = vi.fn();
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    const { container } = render(
      <LineChart
        data={DATA}
        interactive
        onPointClick={onPointClick}
        slotProps={{ pointHit: { onClick } }}
      />,
    );

    fireEvent.click(container.querySelector('[data-part="point-hit"]') as HTMLButtonElement);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onPointClick).not.toHaveBeenCalled();
  });

  it("formats axis labels with the locale prop and defaults to en-US", () => {
    const axisText = (chart: ReactElement, axis: string) => {
      const { container, unmount } = render(chart);
      const text = container.querySelector(`[data-axis='${axis}']`)?.textContent ?? "";
      unmount();
      return text;
    };

    const arabic = <LineChart data={DATA} locale="ar-EG" />;
    const english = <LineChart data={DATA} locale="en-US" />;
    const implicit = <LineChart data={DATA} />;
    expect(axisText(arabic, "value")).toMatch(/[٠-٩]/);
    expect(axisText(arabic, "time")).not.toBe(axisText(english, "time"));
    expect(axisText(implicit, "time")).toBe(axisText(english, "time"));
    expect(axisText(implicit, "time")).toContain("Sep");
  });

  it("forwards consumer props and renders on the server", () => {
    const { container } = render(<LineChart data={DATA} className="custom" />);
    expect(container.querySelector("figure")?.className).toContain("custom");

    const html = assertSSRRenderable(<LineChart data={DATA} aria-label="Server prices" />);
    expect(html).toContain("data-uiify-line-chart");
    expect(html).not.toContain("use client");
  });
});

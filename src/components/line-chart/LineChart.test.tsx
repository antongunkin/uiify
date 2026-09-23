import { fireEvent, render } from "@testing-library/react";
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

  it("forwards consumer props and renders on the server", () => {
    const { container } = render(<LineChart data={DATA} className="custom" />);
    expect(container.querySelector("figure")?.className).toContain("custom");

    const html = assertSSRRenderable(<LineChart data={DATA} aria-label="Server prices" />);
    expect(html).toContain("data-uiify-line-chart");
    expect(html).not.toContain("use client");
  });
});

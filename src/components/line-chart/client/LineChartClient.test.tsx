import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LineChartClient } from "./LineChartClient.js";

const DATA = [
  { time: "2026-09-01", value: 100 },
  { time: "2026-09-02", value: 120 },
  { time: "2026-09-03", value: 110 },
];

const LONG_DATA = Array.from({ length: 100 }, (_, index) => ({
  time: `2026-09-${String(index + 1).padStart(2, "0")}`,
  value: 100 + index,
}));

describe("LineChartClient", () => {
  it("uses the CandleChart viewport for zoom and horizontal scrolling", () => {
    const { container } = render(<LineChartClient data={LONG_DATA} />);
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;

    expect(chart.style.getPropertyValue("--line-scale")).toBe("3.2");
    expect(chart.querySelector('[data-part="scroll-viewport"]')).not.toBeNull();
    expect(chart.querySelector('[data-part="canvas"]')).not.toBeNull();

    fireEvent.wheel(chart, { deltaY: -100 });
    expect(chart.style.getPropertyValue("--line-scale")).toBe("3.84");
  });

  it("updates the crosshair and React readout on pointer movement", () => {
    const onPointPointerMove = vi.fn();
    const { container } = render(
      <LineChartClient data={DATA} onPointPointerMove={onPointPointerMove} />,
    );
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;
    const target = chart.querySelectorAll<HTMLLIElement>('[data-part="points"] > li')[1];
    const hit = target?.querySelector("button") as HTMLButtonElement;
    const pointerMove = createEvent.pointerMove(hit);
    Object.defineProperty(pointerMove, "offsetY", { value: 24 });

    fireEvent(hit, pointerMove);

    expect(target?.getAttribute("data-crosshair-active")).toBe("");
    expect(target?.getAttribute("style")).toContain("--line-cursor-y: 24px");
    expect(chart.querySelector('[data-part="crosshair"]')).not.toBeNull();
    expect(onPointPointerMove).toHaveBeenCalledWith({ index: 1, offsetY: 24 });
  });

  it("selects a point with click and keyboard activation", () => {
    const onPointClick = vi.fn();
    const { container } = render(<LineChartClient data={DATA} onPointClick={onPointClick} />);
    const hit = container.querySelectorAll<HTMLButtonElement>(
      '[data-part="points"] button',
    )[2] as HTMLButtonElement;

    fireEvent.click(hit);
    expect(onPointClick).toHaveBeenCalledWith(2);
    expect(hit.getAttribute("aria-pressed")).toBe("true");

    fireEvent.keyDown(hit, { key: "Enter" });
    expect(onPointClick).toHaveBeenCalledTimes(2);
  });

  it("clears the active point when the pointer leaves", () => {
    const { container } = render(<LineChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;
    const hit = chart.querySelector('[data-part="points"] button') as HTMLButtonElement;

    fireEvent.pointerMove(hit);
    expect(chart.querySelector('[data-part="crosshair"]')).not.toBeNull();
    fireEvent.pointerLeave(hit);
    expect(chart.querySelector('[data-part="crosshair"]')).toBeNull();
  });

  describe("visibleCount live mode", () => {
    /** 684px figure − 84px value-axis column = 600px of points, so 20 visible points are 30px. */
    function stubResizeObserver(): void {
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(private readonly callback: ResizeObserverCallback) {}
          observe(target: Element): void {
            this.callback(
              [
                {
                  target,
                  contentRect: { width: 684, height: 312 },
                  // A classic 15px horizontal scrollbar: border box minus content box.
                  borderBoxSize: [{ inlineSize: 684, blockSize: 327 }],
                  contentBoxSize: [{ inlineSize: 684, blockSize: 312 }],
                } as unknown as ResizeObserverEntry,
              ],
              this as unknown as ResizeObserver,
            );
          }
          unobserve(): void {}
          disconnect(): void {}
        },
      );
    }

    function scrollport(container: HTMLElement): HTMLElement {
      return container.querySelector(
        '[data-part="viewport"] > [data-uiify-virtual-scroll]',
      ) as HTMLElement;
    }

    afterEach(() => vi.unstubAllGlobals());

    it("virtualizes every point and fits the chrome to the visible points", () => {
      const { container } = render(<LineChartClient data={LONG_DATA} visibleCount={20} />);
      const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;

      expect(scrollport(container).dataset.orientation).toBe("horizontal");
      expect(chart.querySelector('[data-part="points"]')).toBeNull();
      expect(chart.querySelectorAll("tbody tr")).toHaveLength(20);
      expect(chart.querySelector("tbody th")?.textContent).toBe(LONG_DATA[80]?.time);
      expect(chart.querySelector('[data-part="readout"]')?.getAttribute("aria-live")).toBe("off");
      expect(chart.querySelector('[data-part="readout"]')?.textContent).toContain("199");

      fireEvent.wheel(chart, { deltaY: -100 });
      expect(chart.style.getPropertyValue("--line-scale")).toBe("1");
    });

    it("draws no segment into the first point", () => {
      stubResizeObserver();
      const { container } = render(
        <LineChartClient data={LONG_DATA.slice(0, 10)} visibleCount={20} />,
      );
      const points = scrollport(container).querySelectorAll('[data-part="point"]');

      expect(points[0]?.hasAttribute("data-first")).toBe(true);
      expect(points[1]?.hasAttribute("data-first")).toBe(false);
    });

    it("follows appends at the newest point, stays put when scrolled back, and resumes", () => {
      stubResizeObserver();
      const { container, rerender } = render(
        <LineChartClient data={LONG_DATA.slice(0, 80)} visibleCount={20} />,
      );
      const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;
      const element = scrollport(container);

      expect(chart.style.getPropertyValue("--line-content-size")).toBe(`${80 * 30}px`);
      // The plot reserves the measured horizontal scrollbar below the time axis.
      expect(chart.style.getPropertyValue("--line-scrollbar-size")).toBe("15px");
      expect(element.scrollLeft).toBe(80 * 30 - 600);

      act(() => {
        element.scrollLeft = 300;
        fireEvent.scroll(element);
      });
      rerender(<LineChartClient data={LONG_DATA.slice(0, 81)} visibleCount={20} />);
      expect(element.scrollLeft).toBe(300);
      expect(chart.style.getPropertyValue("--line-scroll-x")).toBe("300px");
      expect(chart.querySelector("tbody th")?.textContent).toBe(LONG_DATA[10]?.time);

      act(() => {
        element.scrollLeft = 80 * 30 - 600;
        fireEvent.scroll(element);
      });
      rerender(<LineChartClient data={LONG_DATA.slice(0, 82)} visibleCount={20} />);
      expect(element.scrollLeft).toBe(82 * 30 - 600);
    });
  });
});
